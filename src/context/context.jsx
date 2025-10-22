import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { logoutBiometric } from '../utils/webauthnLocal';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const monnaie = "Fcfa";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // État de connexion
  const [userData, setUserData] = useState(false);
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

  const loadUserProfileData = async (silent = false) => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });      
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true); // Mettre à jour l'état de connexion
      } else {
        // Si l'API retourne false mais pas d'erreur 401, c'est un problème côté serveur
        console.log('Erreur API get-profile:', data.message);
        if (!silent) {
          toast.error(data.message || 'Erreur lors du chargement du profil');
        }
        // Ne pas déconnecter automatiquement, laisser l'utilisateur connecté
      }
    } catch (error) {
      console.log('Erreur loadUserProfileData:', error);
      
      // Seulement déconnecter en cas d'erreur 401 (non autorisé) ou 403 (interdit)
      if (error.response?.status === 401 || error.response?.status === 403) {
        if (!silent) {
          toast.error('Session expirée - reconnexion requise');
        }
        logout();
      } else {
        // Pour les autres erreurs (réseau, serveur 500, etc.), ne pas déconnecter
        if (!silent) {
          console.log('Erreur réseau/serveur, utilisateur reste connecté');
          // Ne pas afficher d'erreur pour éviter les toasts gênants
        }
      }
    }
  };

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

  // Fonction de connexion
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    setIsLoggedIn(false);
    setUserData(false);
    setMyMedicalFiles([]);
    // Nettoyer l'état d'authentification biométrique
    logoutBiometric();
    toast.info("Déconnexion réussie");
  };

  const value = {
    doctors, 
    getDoctorsData,
    monnaie,
    token,
    setToken,
    isLoggedIn, // Ajout de l'état de connexion
    setIsLoggedIn, // Ajout du setter pour la connexion
    backendUrl,
    userData, 
    setUserData,
    loadUserProfileData,
    getUserData: loadUserProfileData, // Alias pour compatibilité avec Login.jsx
    myMedicalFiles, 
    setMyMedicalFiles,
    getMyMedicalFiles,
    login, // Ajout de la fonction de connexion
    logout // Ajout de la fonction de déconnexion
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      // Charger les données utilisateur - mode normal pour détecter les vrais problèmes
      loadUserProfileData();
    } else {
      setUserData(false);
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;