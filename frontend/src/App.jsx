import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Contact from './pages/Contact'
import MyAppointment from './pages/MyAppointment'
import MyProfile from './pages/MyProfile'
import Appoinment from './pages/Appoinment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './pages/About'
// import { CheckoutForm, Return } from './pages/Payment';
import { ToastContainer, toast } from 'react-toastify';




const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />

      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appoinment />} />
        {/* <Route path='/checkout' element={<CheckoutForm />} /> */}
        {/* 여기서 :docId는 동적 매개변수로, URL에서 특정 값을 받을 수 있습니다. */}
      </Routes>
      <Footer />

    </div>
  )
}

export default App
