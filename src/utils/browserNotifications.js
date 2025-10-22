/**
 * Service de notifications navigateur pour les patients
 */

// Demander la permission pour les notifications
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('Ce navigateur ne supporte pas les notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Vérifier si les notifications sont autorisées
export const areNotificationsEnabled = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Envoyer une notification
export const showBrowserNotification = (title, options = {}) => {
  if (!areNotificationsEnabled()) {
    console.warn('Notifications non autorisées');
    return null;
  }

  const defaultOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    requireInteraction: false,
    silent: false,
    timestamp: Date.now(),
    ...options
  };

  try {
    const notification = new Notification(title, defaultOptions);
    
    // Auto-fermer après 8 secondes
    setTimeout(() => {
      notification.close();
    }, 8000);

    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return null;
  }
};

// Notification spécifique pour confirmation de rendez-vous patient
export const showAppointmentConfirmationNotification = (appointmentData) => {
  const { doctorName, date, time, address } = appointmentData;
  
  const title = '✅ Rendez-vous confirmé !';
  const body = `Votre rendez-vous avec le Dr. ${doctorName} est confirmé pour le ${date} à ${time}.`;

  return showBrowserNotification(title, {
    body,
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: `appointment-confirmed-${appointmentData.id}`,
    data: {
      type: 'appointment_confirmation',
      appointmentId: appointmentData.id
    }
  });
};

// Notification pour rappel de rendez-vous
export const showAppointmentReminderNotification = (appointmentData) => {
  const { doctorName, time } = appointmentData;
  
  const title = '⏰ Rappel de rendez-vous';
  const body = `Rappel : Votre rendez-vous avec le Dr. ${doctorName} est à ${time}`;

  return showBrowserNotification(title, {
    body,
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: `appointment-reminder-${appointmentData.id}`,
    data: {
      type: 'appointment_reminder',
      appointmentId: appointmentData.id
    }
  });
};

// Notification personnalisée
export const showCustomNotification = (title, message, type = 'info') => {
  const icons = {
    info: '/logo.svg',
    success: '/logo.svg',
    warning: '/logo.svg',
    error: '/logo.svg'
  };

  return showBrowserNotification(title, {
    body: message,
    icon: icons[type] || icons.info,
    badge: icons[type] || icons.info,
    tag: `custom-${Date.now()}`
  });
};
