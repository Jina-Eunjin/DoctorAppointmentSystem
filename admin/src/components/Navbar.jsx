import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext)
    //useContext(AdminContext) → AdminContext에서 aToken과 setAToken을 가져옴.

    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
    }
    //aToken이 존재하면, setAToken('')을 실행해서 토큰을 빈 문자열로 설정 (즉, 상태에서 제거).

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-gray-200 border-b bg-white '>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
            </div>
            <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
        </div>
    )
}

export default Navbar
