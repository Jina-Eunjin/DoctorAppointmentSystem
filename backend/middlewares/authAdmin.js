import jwt from 'jsonwebtoken'

//Middleware는 요청(Request)과 응답(Response) 사이에서 실행되는 함수입니다. -> 요청을 처리하는 도중 여러 번 실행 가능 -> 이 후  컨트롤러 함수 실행
//주로 Express.js 같은 웹 프레임워크에서 사용되며, 요청을 가로채서 원하는 작업을 수행한 후 다음 단계로 넘깁니다.
//로그 기록 (Logging), 인증 및 권한 관리 (Authentication & Authorization) → 사용자가 로그인했는지, 권한이 있는지 확인
//요청 데이터 처리 (Parsing) → JSON, URL-encoded 데이터 등을 해석해서 req.body에 저장
//에러 핸들링 (Error Handling) → 요청 처리 중 발생한 오류를 처리

// admin authentication middlerware
const authAdmin = async (req, res, next) => {

    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }

        next()
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }



}

export default authAdmin