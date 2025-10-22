import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/context';
import { 
  requestNotificationPermission, 
  showAppointmentConfirmationNotification,
  areNotificationsEnabled 
} from '../utils/browserNotifications';

const NotificationManager = () => {
  const { token, isLoggedIn } = useContext(AppContext);

  // Demander les permissions de notification au démarrage
  useEffect(() => {
    const initNotifications = async () => {
      if (isLoggedIn) {
        await requestNotificationPermission();
      }
    };
    initNotifications();
  }, [isLoggedIn]);

  // Écouter les événements de notification
  useEffect(() => {
    if (!isLoggedIn || !areNotificationsEnabled()) return;

    const handleStorageChange = (e) => {
      if (e.key === 'appointment_confirmed') {
        try {
          const appointmentData = JSON.parse(e.newValue || '{}');
          if (appointmentData && appointmentData.id) {
            showAppointmentConfirmationNotification({
              id: appointmentData.id,
              doctorName: appointmentData.doctorName,
              date: appointmentData.date,
              time: appointmentData.time,
              address: appointmentData.address
            });
            // Supprimer le message après traitement
            localStorage.removeItem('appointment_confirmed');
          }
        } catch (error) {
          console.error('Erreur traitement notification:', error);
        }
      }
    };

    // Écouter les événements storage (externe) et personnalisés (même onglet)
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleStorageChange); // Pour les événements dispatchEvent

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default NotificationManager;
