import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointment = () => {

    const { backendUrl, token } = useContext(AppContext)

    const [appointments, setAppointments] = useState([])
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        // console.log('slotDate:', slotDate)
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }


    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                setAppointments(data.appointments.reverse())
                console.log('appointments_data', data.appointments)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const appointmentStripe = async (appointmentId) => {
        try {
            // Stripe Checkout 세션을 생성하는 API 호출
            const { data } = await axios.post(backendUrl + '/api/payment/create-checkout-session', { appointmentId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('appointmentStripe_data', data)
            if (data.sessionId) {
                const stripe = window.Stripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);
                console.log('stripe', stripe)
                const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

                if (error) {
                    toast.error('Error redirecting to checkout');
                }
            } else {
                toast.error('Failed to create checkout session');
            }
        } catch (error) {
            // API 호출 중 오류 처리
            console.error(error)
            toast.error('An error occurred while creating checkout session.');
        }
    }

    // ✅ 결제 완료 후 session_id로 상태 확인
    const checkPaymentStatus = async (sessionId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/payment/session-status?session_id=${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('💳 Payment check result:', data);
            if (data.status === 'succeeded') {
                toast.success('Payment completed successfully!');
                getUserAppointments(); // 결제 성공 후 목록 새로고침
            }
        } catch (error) {
            console.error('❌ Error checking payment session:', error);
        }
    }


    const cancleAppointment = async (appointmentId) => {
        try {
            // console.log('appointmentId', appointmentId)
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment',
                { appointmentId }, // 여기서 body로 appointmentId 전송
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments();

            // ✅ URL에서 session_id 추출 후 결제 상태 확인
            const query = new URLSearchParams(location.search);
            const sessionId = query.get('session_id');
            if (sessionId) {
                checkPaymentStatus(sessionId);
            }
        }
    }, [token, location]);


    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
            <div>
                {appointments.map((item, index) => (
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                        <div>
                            <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-zinc-700 font-medium  mt-1
                            '>Address:</p>
                            <p className='text-xs'>{item.docData.address.line1}</p>
                            <p className='text-xs'>{item.docData.address.line2}</p>
                            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                            <p className='text-neutral-800 font-semibold'>{`$ ${item.amount}`}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end'>
                            {!item.cancelled && !item.payment && (
                                <button
                                    onClick={() => appointmentStripe(item._id)}
                                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition duration-300"
                                >
                                    Pay Online
                                </button>
                            )}

                            {item.payment && (
                                <button
                                    disabled
                                    className="sm:min-w-48 py-2 border border-emerald-500 text-emerald-600 rounded bg-emerald-50 cursor-default"
                                >
                                    Payment Complete
                                </button>
                            )}
                            {!item.cancelled && <button onClick={() => cancleAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition duration-300'>Cancel appointment</button>}
                            {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointment
