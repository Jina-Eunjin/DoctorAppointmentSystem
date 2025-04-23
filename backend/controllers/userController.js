import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js';


//userController function will create API logic for user like login, register, get profile, update profile, 
// book appointment, displaying the booked appointment, cancelling the appointment, add payment gateway

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }
        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }
        //validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }

        // 중복 이메일 확인
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // // hasing user password
        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(password, salt)

        const userData = User({
            name,
            email,
            password, // password will be hashed automatically by pre-save middleware
        })

        const user = await userData.save()

        // Generating JWT token for the newly registered user
        // jwt.sign(payload, secretKey)를 직접 사용, user._id를 payload에 포함하여 서명,직접 JWT를 생성하는 방식이므로 코드가 짧고 간단, 유효기간(expiration time), 알고리즘 설정 등을 매번 지정해야 할 수도 있음
        // 코드 중복 가능성이 높음 (매번 JWT를 생성할 때마다 같은 로직을 반복), 설정(유효 기간, 알고리즘 등)을 관리하기 어려움, 코드가 여러 곳에서 변경될 경우 유지보수가 어려움
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });


        // const token = generateToken(user);  -> middleware/auth.js 에서 정의 필요(boadgamecafe 참고)
        //JWT 생성을 함수화하여 재사용 가능, 토큰 생성 방식이 중앙에서 관리되므로 유지보수 용이, 컨트롤러(loginUser 등)에서는 깔끔한 코드 유지 가능, 보안적인 관리(예: 알고리즘 변경)도 쉽게 적용 가능
        // res.cookie() 사용의 장점: 쿠키를 사용하면 프론트엔드에서 직접 JWT를 다룰 필요가 없음 → 보안성 향상, httpOnly: true → XSS 공격을 방지 (자바스크립트에서 접근 불가), secure: true → HTTPS에서만 작동하여 보안 강화, sameSite: 'Strict' → CSRF 공격 방지
        // res.cookie() 없이 token만 반환하면? JWT를 프론트엔드에서 localStorage 또는 sessionStorage에 저장, localStorage는 XSS 공격에 취약 → 보안 위험 증가

        // res.cookie('accessToken', token, { 
        //     httpOnly: true, 
        //     secure: true, 
        //     sameSite: 'Strict',
        // 	path: '/',
        // 	maxAge: 3600000
        // });


        // Returning the response with the token
        res.json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                name: user.name,
                email: user.email,
                _id: user._id
            }
        });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        // Check if the password matches the one stored in the database
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
            res.json({
                success: true,
                message: "User login successfully",
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    _id: user._id
                }
            })
        } else {
            return res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {

        const userData = await User.findById(req.user._id).select('-password')
        // console.log('조회된 사용자 데이터:', userData);

        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.imageFile

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        const userId = req.user.id;

        //findByIdAndUpdate: 특정 _id를 가진 문서를 찾고, 데이터를 업데이트함.
        await User.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageURL = imageUpload.secure_url;
            await User.findByIdAndUpdate(userId, { image: imageURL });
            res.json({ success: true, message: "Profile updated", image: imageURL });
        } else {
            res.json({ success: true, message: "Profile updated" });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body

        const userId = req.user.id;

        const docData = await doctorModel.findById(docId).select('-password')
        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor is not available' })
        }


        let slots_booked = docData.slots_booked

        //checking fro slot availability
        //slots_booked 객체는 slotDate(날짜)를 키로 사용 -> 즉, slots_booked는 날짜별로 예약된 시간을 배열로 저장
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot is not available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await User.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }
        const newAppoinment = new appointmentModel(appointmentData)
        await newAppoinment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get user appointment for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to cancle appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id; // 서버에서 JWT 토큰을 통해 인증된 사용자 ID이므로, 클라이언트가 조작할 수 없습니다
        const { appointmentId } = req.body // 여기서 req.body에서 appointmentId를 가져옴

        //findByIdAndUpdate()는 MongoDB(Mongoose)에서 데이터를 업데이트하는 비동기 함수(async) ->이 함수는 Promise를 반환하며, 데이터베이스 작업이 끝날 때까지 시간이 걸릴 수 있음
        const appointmentData = await appointmentModel.findById(appointmentId)
        console.log('appointmentData', appointmentData)

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ succcess: false, message: "Unauthorized action" })
        }
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


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }