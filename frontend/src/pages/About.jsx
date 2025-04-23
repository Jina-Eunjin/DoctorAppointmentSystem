import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-500'>
                <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p>Terveystalo is the largest private healthcare service provider in Finland in terms of revenue and network. Terveystalo is also a leading occupational health provider in the Nordic region. We offer a wide variety of primary health care, specialized care, and well-being services for corporate and private customers and the public sector. Terveystalo’s s digital services are available 24/7, regardless of time and place. Health and well-being services are also provided by over 377 clinics across Finland. In Sweden, we offer occupational health services at 152 clinics. Terveystalo is listed on the Helsinki Stock Exchange.</p>
                    <p>In 2023, Terveystalo had approximately 1.2 million individual customers in Finland and the number of customer appointments was approximately 7.6 million. Terveystalo employs over 15,500 healthcare and well-being professionals.  </p>
                    <b>Our Vision</b>
                    <p>In 2023 our revenue was EUR 1,286 million. Terveystalo is listed on the Helsinki Stock Exchange and has a predominantly Finnish ownership. Terveystalo’s headquarters is located in Helsinki.</p>
                </div>
            </div>


            <div className='text-xl my-4'>
                <p>
                    WHY <span className='text-gray-700 font-semibold' >CHOOSE US</span>
                </p>
            </div>

            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Efficiency:</b>
                    <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Convenience:</b>
                    <p>Access to a network of trusted healthcare professionals in your area.</p></div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Personalization:</b>
                    <p>Tailored recommendation and reminders to help you stay on top of your health.</p></div>
            </div>

        </div>

    )
}

export default About
