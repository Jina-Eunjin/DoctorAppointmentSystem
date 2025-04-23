import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md: mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ---- left section---- */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>115-year-old Mehiläinen is a traditional but rapidly developing and growing forerunner in its sector. Mehiläinen invests in the effectiveness and quality of care in all its business areas, and develops and exports Finnish digital health expertise at the forefront of the industry.</p>
                </div>
                {/* ---- center section---- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                {/* ---- right section---- */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+358 (0)900 30 000</li>
                        <li>Address: Jaakonkatu 3 A, 6th floor, 00100 Helsinki</li>
                    </ul>
                </div>
                {/* ---- copyright section---- */}

            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ Prescipto - All Right Reserved.</p>
            </div>
        </div >
    )
}

export default Footer
