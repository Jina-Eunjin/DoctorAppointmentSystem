// Route(라우트)는 클라이언트의 요청(Request) URL과 HTTP 메서드(GET, POST, PUT, DELETE 등)에 따라 특정한 핸들러 함수를 실행하는 것
// 어떤 요청이 들어왔을 때 어떤 동작을 할지 결정하는 역할을 합니다.
//Express.js 같은 프레임워크에서는 app.get(), app.post() 등의 메서드를 사용하여 라우트를 정의할 수 있습니다.


import express from 'express'
import { addDoctor, allDoctors, loginAdmin, appointmentAdmin, appoinmentCancel } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'


const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appoinmentCancel)

export default adminRouter