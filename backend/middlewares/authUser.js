import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';


//Middleware는 요청(Request)과 응답(Response) 사이에서 실행되는 함수입니다. -> 요청을 처리하는 도중 여러 번 실행 가능 -> 이 후  컨트롤러 함수 실행
//주로 Express.js 같은 웹 프레임워크에서 사용되며, 요청을 가로채서 원하는 작업을 수행한 후 다음 단계로 넘깁니다.
//로그 기록 (Logging), 인증 및 권한 관리 (Authentication & Authorization) → 사용자가 로그인했는지, 권한이 있는지 확인
//요청 데이터 처리 (Parsing) → JSON, URL-encoded 데이터 등을 해석해서 req.body에 저장
//에러 핸들링 (Error Handling) → 요청 처리 중 발생한 오류를 처리

// user authentication middlerware
const authUser = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader);
        if (!authHeader) {
            return res.json({ success: false, message: 'Not Authorized. Login Again -1' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again -2' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(token_decode.id); // 토큰에서 추출한 ID로 사용자 조회
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        req.user = user; // 요청 객체에 사용자 정보를 추가
        next();
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export default authUser