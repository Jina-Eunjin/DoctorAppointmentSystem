import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

//whenever we call 'get-profile' API, we will provide the token in header, we will be able to get the user profile details.
userRouter.get('/get-profile', authUser, getProfile)

//POST를 사용하면 일부 필드만 업데이트 가능 -> PUT을 사용하면 **모든 데이터(전화번호, 주소, 성별 등)**를 다시 보내야 함.
//일반적으로 파일 업로드는 POST 요청을 통해 처리됨.
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)




export default userRouter