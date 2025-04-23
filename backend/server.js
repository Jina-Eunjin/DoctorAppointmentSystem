import express from 'express'  //express: Node.js에서 HTTP 서버를 쉽게 만들 수 있게 해주는 프레임워크
import cors from 'cors' //cors: cross-origin resource sharing을 허용하는 미들웨어 
import 'dotenv/config'  //dotenv/config: .env 파일에서 환경 변수를 로드 -> precess.env.PORT같은 변수 사용
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import paymentRouter from './routes/paymentRoute.js'


// app config  
const app = express() //Express 애플리케이션 생성
const port = process.env.PORT || 4000  // .env파일에서 PORT 값 가져옴
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())  // express.json() : JSON 데이터 파싱할 수 있도록 설정 -> 클라이언트에서 JSON형식으로 데이터를 보내면 자동 변환
app.use(cors())  // -> 다른 도메인에서 API요청을 보낼 수 있도록 설정해줌

//api endpoints
app.use('/api/admin', adminRouter)
// localhost:4000/api/admin/add-doctor -> whenever we will call this api, our api controller function(addDoctor) will be executed
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)


app.get('/', (req, res) => {
    res.send('API WORKING')
})  // app.get('/'): 루트 경로(/)로 GET 요청이 오면 실행됨 -> req: 클라이언트의 요청 정보 (Request) -> res: 서버의 응답 정보 (Response)
// -> res.send('API WORKING'): 클라이언트에게 "API WORKING"이라는 응답을 보냄

app.listen(port, () => console.log("Server Started", port)) // app.listen(port, ...): 해당 포트에서 서버를 실행