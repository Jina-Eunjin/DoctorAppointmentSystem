//controller: 클라이언트 요청을 처리하고 응답을 반환하는 함수 -> 요청이 최종적으로 도달하는 곳으로 middleware 이후 실행
//비즈니스 로직 처리 → 데이터베이스 조회, 계산, API 호출
//클라이언트에 응답(Response) 반환
//요청 데이터를 검증 후 적절한 서비스 호출

import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import appointmentModel from '../models/appointmentModel.js';
import jwt from 'jsonwebtoken'



// API for admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for adding doctor
const addDoctor = async (req, res) => {

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file


        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//API to get all appointment
const appointmentAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//API for appointment cancellation
const appoinmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body // 여기서 req.body에서 appointmentId를 가져옴

        //findByIdAndUpdate()는 MongoDB(Mongoose)에서 데이터를 업데이트하는 비동기 함수(async) ->이 함수는 Promise를 반환하며, 데이터베이스 작업이 끝날 때까지 시간이 걸릴 수 있음
        const appointmentData = await appointmentModel.findById(appointmentId)
        console.log('appointmentData', appointmentData)


        //{ cancelled: true }는 MongoDB에서 특정 예약(appointment)의 cancelled 값을 true로 변경하는 코드
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e != slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, appoinmentCancel }