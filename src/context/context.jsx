import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const monnaie = "Fcfa";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'): false)
  const [userData, setUserData] = useState(false)
  console.log("Doctors data:", doctors);



  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { Authorization: `Bearer ${token}` }, // Utilisez le bon format d'en-tête
      });      
      if (data.success) {
        setUserData(data.userData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const value = {
    doctors, getDoctorsData,
    monnaie,
    token,setToken,
    backendUrl,
    userData, setUserData,
    loadUserProfileData
  };

  // Ajoutez un tableau de dépendances vide pour que `useEffect` ne s'exécute qu'une fois
  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
    loadUserProfileData()
    }else{
      setUserData(false)
    }
  },[token] )

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;