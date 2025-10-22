import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
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
import NotificationManager from './components/NotificationManager'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppContextProvider, { AppContext } from "./context/context";

// Composant de route privée avec vérification
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export const App = () => {
  return (
    <AppContextProvider>
      <NotificationManager />
      <ToastContainer />
      <div className='mx-4 sm:mx-[10%]'>
        <Navbar /> {/* Toujours affiché */}
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/docteurs" element={<Doctor />} />
          <Route path="/docteurs/:speciality" element={<Doctor />} />
          <Route path="/à-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Routes privées - nécessitent une connexion */}
          <Route 
            path="/mon-profile" 
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/mes-rendez-vous" 
            element={
              <PrivateRoute>
                <MyAppointments />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/rendez-vous/:docId" 
            element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/mon-dossier" 
            element={
              <PrivateRoute>
                <MyFiles />
              </PrivateRoute>
            } 
          />
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer /> {/* Toujours affiché */}
      </div>
    </AppContextProvider>
  )
}

export default App