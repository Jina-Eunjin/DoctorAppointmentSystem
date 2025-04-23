import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import RelatedDoctors from '../components/RelatedDoctors'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import dayjs from 'dayjs';


const Appointment = () => {

  const { docId } = useParams()
  // useParams는 URL 경로의 매개변수 값을 반환합니다. 반환된 값은 객체 형태이며, 경로에서 정의한 매개변수 이름(:docId)과 동일한 이름의 속성으로 해당 값을 가져옵니다.
  // URL: /appointment/doc123 -> useParams가 URL의 :docId 값인 'doc123'을 추출 -> docId 변수에 'doc123' 값이 할당 -> 이후 docId는 컴포넌트 내에서 사용

  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')


  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId) // URL에서 가져온 동적 매개변수 값인 docId 값으로 doctors 배열에서 찾기
    setDocInfo(docInfo) // 찾은 데이터를 상태에 저장
  }

  const getAvailableSlots = async () => {
    setDocSlots([])  // React 상태 함수로 상태 변경
    // React에 의해 제공되는 함수(setDocSlots)를 사용해 상태를 변경하면 React는 내부적으로 상태가 변경된 것을 감지 -> React가 컴포넌트를 다시 렌더링하고 변경된 상태를 반영

    // getting current date, 현재 날짜와 시간을 나타내는 Date 객체를 생성
    // let today = new Date()

    // for (let i = 0; i < 7; i++) {
    //   // getting date with index
    //   let currentDate = new Date(today)
    //   currentDate.setDate(today.getDate() + i)

    //   // setting end time of the date with index
    //   let endTime = new Date()
    //   endTime.setDate(today.getDate() + i)
    //   endTime.setHours(21, 0, 0, 0)

    //   // setting hours
    //   if (today.getDate() === currentDate.getDate()) {
    //     currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
    //     currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
    //   } else {
    //     currentDate.setHours(10)
    //     currentDate.setMinutes(0)
    //   }

    //   let timeSlots = []

    //   while (currentDate < endTime) {
    //     let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    //     //add slot to array
    //     timeSlots.push({
    //       datetime: new Date(currentDate),
    //       time: formattedTime
    //     })

    //     //Increment current time by 30 minutes
    //     currentDate.setMinutes(currentDate.getMinutes() + 30)
    //   }

    let today = dayjs();

    for (let i = 0; i < 7; i++) {
      let currentDate = today.add(i, 'day').startOf('day').hour(10);
      let endTime = currentDate.hour(21);
      let timeSlots = [];
  
      while (currentDate.isBefore(endTime)) {
        let formattedTime = currentDate.format('hh:mm A');
        let slotDate = currentDate.format('D_M_YYYY');
  
        const isSlotAvailable = !(docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime));
  
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: currentDate.toDate(),
            time: formattedTime,
          });
        }
  
        currentDate = currentDate.add(30, 'minute');
      }
  
      setDocSlots(prev => ([...prev, timeSlots]))
    }

  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year
      console.log(slotDate)

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(() => { fetchDocInfo() }, [doctors, docId])
  //useEffect는 컴포넌트가 처음 렌더링될 때 또는 doctors나 docId 값이 변경될 때마다 fetchDocInfo를 실행, 이 과정에서 docId는 항상 최신 URL 값을 기반으로 작업
  useEffect(() => { getAvailableSlots() }, [docInfo])

  useEffect(() => { console.log(docSlots) }, [docSlots])



  return docInfo && (
    <div>
      {/* --------Doctor Details -------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ---------Doc Info : name, degree, experience---------- */}
          <p className='flex item-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex item-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* ---------Doctor About---------- */}
          <div>
            <p className='flex items-center gap-1 text-sm fond text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[-700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>


      {/* ---------Booking slots----------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4'>
          {docSlots.length && docSlots.map((item, index) => (
            <div onClick={() => setSlotIndex(index)}
              // 사용자가 날짜를 클릭하면 setSlotIndex(index)가 호출 -> index 값이 slotIndex 상태에 저장 -> React는 새로운 상태(slotIndex)를 기반으로 UI를 다시 렌더링
              // setSlotIndex는 단지 "상태를 변경하는 도구" 함수일 뿐, 데이터를 저장하지 않음
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-black' : 'border border-gray-200'}`} key={index}>
              <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex item gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index) =>
          (<p onClick={() => setSlotTime(item.time)}
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
            {item.time.toLowerCase()}
          </p>))}
        </div>

        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
          Book on appointment</button>

      </div>

      {/* ----------Listing Related Doctors--------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment
