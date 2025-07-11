import React from 'react'
import { Route, Routes} from 'react-router-dom'
import Home from './pages/home'
import Doctor from './pages/Doctor'
import Contact from './pages/Contact'
import Login from './pages/Login'
import About from './pages/About'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointments from './pages/Appointments'
import MyFiles from './pages/MyFiles'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppContextProvider from "./context/context";


export const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
    <AppContextProvider>
    <ToastContainer />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docteurs" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/docteurs/:speciality" element={<Doctor />} />
        <Route path="/à-propos" element={<About />} />
        <Route path="/mon-profile" element={<MyProfile />} />
        <Route path="/mes-rendez-vous" element={<MyAppointments />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rendez-vous/:docId" element={<Appointments />} />
        <Route path="/mon-dossier" element={<MyFiles />} />
      </Routes>
      <Footer/>
    </AppContextProvider>
    </div>
  )
}

export default App
