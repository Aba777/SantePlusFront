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
  const [myMedicalFiles, setMyMedicalFiles] = useState([]);
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
        headers: { Authorization: `Bearer ${token}` },
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

  const getMyMedicalFiles = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/my-files',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setMyMedicalFiles(data.files);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Erreur récupération fichiers patient :", error);
      toast.error(error.message);
    }
  };

  const value = {
    doctors, getDoctorsData,
    monnaie,
    token,setToken,
    backendUrl,
    userData, setUserData,
    loadUserProfileData,
    myMedicalFiles, setMyMedicalFiles,
    getMyMedicalFiles
  };

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