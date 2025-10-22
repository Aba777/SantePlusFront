import { startRegistration, startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser';

/**
 * Utilitaire pour l'authentification WebAuthn locale (client-side uniquement)
 * Pas de vérification serveur - juste pour une authentification locale
 */

const STORAGE_KEY = 'webauthn_credentials';
const AUTH_KEY = 'webauthn_authenticated';

/**
 * Vérifie si WebAuthn est supporté par le navigateur
 */
export const isWebAuthnSupported = () => {
  return browserSupportsWebAuthn();
};

/**
 * Convertit un Uint8Array en base64url
 */
const uint8ArrayToBase64URL = (uint8Array) => {
  if (!uint8Array) {
    throw new Error('Invalid input: uint8Array is null or undefined');
  }
  
  let array;
  if (uint8Array instanceof ArrayBuffer) {
    array = new Uint8Array(uint8Array);
  } else if (uint8Array instanceof Uint8Array) {
    array = uint8Array;
  } else {
    throw new Error('Invalid input: expected Uint8Array or ArrayBuffer');
  }
  
  // Méthode plus robuste pour la conversion
  let binary = '';
  for (let i = 0; i < array.length; i++) {
    binary += String.fromCharCode(array[i]);
  }
  
  const base64 = btoa(binary);
  
  // Convertir en base64url et retirer le padding
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Convertit une chaîne base64url en Uint8Array
 */
const base64URLToUint8Array = (base64URL) => {
  if (typeof base64URL !== 'string') {
    throw new Error('Invalid input: expected string');
  }
  
  // Restaurer le format base64 standard
  const base64 = base64URL
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Ajouter padding si nécessaire
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return bytes;
};

/**
 * Génère des options d'enregistrement pour un nouvel utilisateur
 */
const generateRegistrationOptions = (username) => {
  try {
    console.log('🔧 Génération des options avec username:', username);
    
    // Vérifier les prérequis
    if (!window.location.hostname) {
      throw new Error('Hostname non disponible');
    }
    
    if (!crypto || !crypto.getRandomValues) {
      throw new Error('Crypto API non disponible');
    }
    
    // Générer un ID utilisateur unique basé sur le nom d'utilisateur
    const userIdString = username + Date.now().toString();
    console.log('🔧 userIdString:', userIdString);
    
    const userIdBytes = new TextEncoder().encode(userIdString);
    console.log('🔧 userIdBytes length:', userIdBytes.length);
    
    // Générer un challenge aléatoire et le convertir en base64url
    const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
    console.log('🔧 challengeBytes length:', challengeBytes.length);
    
    let challengeBase64, userIdBase64;
    try {
      challengeBase64 = uint8ArrayToBase64URL(challengeBytes);
      userIdBase64 = uint8ArrayToBase64URL(userIdBytes);
      console.log('🔧 Conversions base64 réussies');
    } catch (conversionError) {
      console.error('❌ Erreur de conversion base64:', conversionError);
      throw new Error(`Erreur de conversion: ${conversionError.message}`);
    }
    
    const options = {
      rp: {
        name: 'Santé Plus',
        id: window.location.hostname,
      },
      user: {
        id: userIdBase64,
        name: username,
        displayName: username,
      },
      challenge: challengeBase64,
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        residentKey: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    };
    
    console.log('🔧 Options finales générées avec succès');
    return options;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération des options:', error);
    throw new Error(`Impossible de générer les options d'enregistrement: ${error.message}`);
  }
};

/**
 * Génère les options d'authentification
 */
const generateAuthOptions = () => {
  const storedCredentials = getStoredCredentials();
  
  // Vérifier que nous avons des credentials valides
  if (!storedCredentials || storedCredentials.length === 0) {
    throw new Error('Aucune authentification biométrique configurée');
  }
  
  // Vérifier que crypto est disponible
  if (!crypto || !crypto.getRandomValues) {
    throw new Error('Crypto API non disponible');
  }
  
  // Générer un challenge aléatoire et le convertir en base64url
  const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
  const challengeBase64 = uint8ArrayToBase64URL(challengeBytes);
  
  console.log('🔧 Options d\'auth générées:', {
    challengeLength: challengeBytes.length,
    credentialsCount: storedCredentials.length,
    hostname: window.location.hostname
  });
  
  // Filtrer et valider les credentials
  const validCredentials = storedCredentials
    .filter(cred => cred && cred.credentialID) // S'assurer que le credential existe et a un ID
    .map(cred => {
      try {
        return {
          id: cred.credentialID, // SimpleWebAuthn gère la conversion automatiquement
          type: 'public-key',
          transports: cred.transports || ['internal']
        };
      } catch (error) {
        console.error('Erreur lors du traitement du credential:', error);
        return null;
      }
    })
    .filter(Boolean); // Retirer les valeurs null
  
  if (validCredentials.length === 0) {
    throw new Error('Aucun credential valide trouvé');
  }
  
  return {
    rpId: window.location.hostname,
    challenge: challengeBase64,
    allowCredentials: validCredentials,
    userVerification: 'preferred',
    timeout: 60000
  };
};

/**
 * Stocke les credentials localement
 */
const storeCredentials = (credentials) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Erreur lors du stockage des credentials:', error);
  }
};

/**
 * Récupère les credentials stockés
 */
const getStoredCredentials = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture des credentials:', error);
    return [];
  }
};

/**
 * Marque l'utilisateur comme authentifié localement
 */
export const setAuthenticated = (authenticated = true) => {
  try {
    sessionStorage.setItem(AUTH_KEY, authenticated.toString());
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'état d\'authentification:', error);
  }
};

/**
 * Vérifie si l'utilisateur est authentifié localement
 */
export const isAuthenticated = () => {
  try {
    const auth = sessionStorage.getItem(AUTH_KEY);
    return auth === 'true';
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};

/**
 * Démarre le processus d'enregistrement d'une nouvelle authentification
 */
export const registerBiometric = async (username = 'Utilisateur') => {
  try {
    if (!isWebAuthnSupported()) {
      throw new Error('WebAuthn n\'est pas supporté par ce navigateur');
    }

    // Vérifier si on est en HTTPS ou localhost
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      throw new Error('WebAuthn nécessite HTTPS ou localhost');
    }

    const options = generateRegistrationOptions(username);
    
    console.log('🔄 Démarrage de l\'enregistrement biométrique...');
    console.log('Options simplifiées:', {
      rpName: options.rp.name,
      rpId: options.rp.id,
      userName: options.user.name,
      challengeLength: options.challenge.length
    });
    
    const credential = await startRegistration(options);
    
    console.log('📋 Credential reçu:', credential);
    
    // Convertir l'ID du credential en base64url pour le stockage
    let credentialIDString;
    try {
      if (credential.id instanceof ArrayBuffer) {
        credentialIDString = uint8ArrayToBase64URL(new Uint8Array(credential.id));
      } else if (credential.id instanceof Uint8Array) {
        credentialIDString = uint8ArrayToBase64URL(credential.id);
      } else {
        credentialIDString = credential.id;
      }
    } catch (error) {
      console.error('Erreur lors de la conversion de l\'ID:', error);
      throw new Error('Format d\'ID de credential invalide');
    }
    
    // Simuler une vérification locale (normalement fait côté serveur)
    const mockVerification = {
      verified: true,
      credentialID: credentialIDString,
      publicKey: credential.publicKey,
      counter: 0,
      transports: credential.response?.transports || ['internal']
    };

    if (mockVerification.verified && mockVerification.credentialID) {
      // Stocker les credentials localement
      const storedCredentials = getStoredCredentials();
      storedCredentials.push({
        credentialID: mockVerification.credentialID,
        publicKey: mockVerification.publicKey,
        counter: mockVerification.counter,
        transports: mockVerification.transports,
        registeredAt: Date.now()
      });
      
      storeCredentials(storedCredentials);
      setAuthenticated(true);
      
      console.log('✅ Enregistrement biométrique réussi');
      return { success: true, message: 'Authentification biométrique configurée avec succès' };
    } else {
      throw new Error('Échec de la vérification locale - credential invalide');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
    console.error('Détails de l\'erreur:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Gestion spécifique des erreurs WebAuthn
    let errorMessage = 'Erreur lors de la configuration biométrique';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Authentification refusée par l\'utilisateur ou l\'appareil. Veuillez autoriser l\'accès biométrique.';
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Type d\'authentification non supporté sur cet appareil. Veuillez utiliser un autre navigateur ou appareil.';
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Erreur de sécurité lors de la configuration. Connexion HTTPS requise.';
    } else if (error.name === 'InvalidStateError') {
      errorMessage = 'Authentification déjà enregistrée ou conflit d\'état. Veuillez réessayer.';
    } else if (error.name === 'ConstraintError') {
      errorMessage = 'Contraintes d\'authentification non respectées. Utilisez un autre type d\'authentification.';
    } else if (error.message) {
      if (error.message.includes('base64URLString.replace')) {
        errorMessage = 'Erreur de format des données. Veuillez rafraîchir la page et réessayer.';
      } else if (error.message.includes('Invalid input: expected')) {
        errorMessage = 'Erreur de données d\'entrée. Veuillez réessayer.';
      } else {
        errorMessage = `Erreur technique: ${error.message}`;
      }
    }
    
    // Log plus détaillé pour debug
    console.error('🔍 Message d\'erreur final:', errorMessage);
    
    return { 
      success: false, 
      message: errorMessage,
      errorDetails: {
        name: error.name,
        originalMessage: error.message
      }
    };
  }
};

/**
 * Démarre le processus d'authentification
 */
export const authenticateBiometric = async () => {
  try {
    if (!isWebAuthnSupported()) {
      throw new Error('WebAuthn n\'est pas supporté par ce navigateur');
    }

    // Vérifier et nettoyer l'état d'authentification avant de commencer
    const currentAuthState = isAuthenticated();
    if (currentAuthState) {
      console.log('🧹 Nettoyage de l\'état d\'authentification existant...');
      setAuthenticated(false);
    }

    const storedCredentials = getStoredCredentials();
    if (storedCredentials.length === 0) {
      throw new Error('Aucune authentification biométrique configurée');
    }

    // Vérifier la validité des credentials stockés
    const validCredentials = storedCredentials.filter(cred => 
      cred && cred.credentialID && typeof cred.credentialID === 'string'
    );
    
    if (validCredentials.length === 0) {
      console.log('🗑️ Credentials invalides détectés, suppression...');
      localStorage.removeItem(STORAGE_KEY);
      throw new Error('Configuration biométrique corrompue. Veuillez la reconfigurer.');
    }

    const options = generateAuthOptions();
    
    console.log('🔄 Démarrage de l\'authentification biométrique...', {
      credentialsCount: validCredentials.length,
      optionsGenerated: !!options
    });
    
    const credential = await startAuthentication(options);
    
    // Convertir l'ID du credential reçu pour la comparaison
    let credentialIDString;
    try {
      if (credential.id instanceof ArrayBuffer) {
        credentialIDString = uint8ArrayToBase64URL(new Uint8Array(credential.id));
      } else if (credential.id instanceof Uint8Array) {
        credentialIDString = uint8ArrayToBase64URL(credential.id);
      } else {
        credentialIDString = credential.id;
      }
    } catch (error) {
      console.error('Erreur lors de la conversion de l\'ID:', error);
      throw new Error('Format d\'ID de credential invalide');
    }
    
    // Simuler une vérification locale
    const storedCredential = storedCredentials.find(
      cred => cred.credentialID === credentialIDString
    );

    if (storedCredential) {
      // Mettre à jour le compteur (simulation)
      storedCredential.counter = Math.max(storedCredential.counter, (credential.response.counter || 0));
      storeCredentials(storedCredentials);
      
      setAuthenticated(true);
      
      console.log('✅ Authentification biométrique réussie');
      return { success: true, message: 'Authentification réussie' };
    } else {
      throw new Error('Credentials non reconnus');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error);
    console.error('Détails complets de l\'erreur:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Gestion spécifique des erreurs WebAuthn
    let errorMessage = 'Erreur lors de l\'authentification biométrique';
    let shouldClearCredentials = false;
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Authentification refusée par l\'utilisateur ou l\'appareil';
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Type d\'authentification non supporté sur cet appareil';
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Erreur de sécurité. Veuillez réessayer';
    } else if (error.name === 'InvalidStateError') {
      errorMessage = 'État d\'authentification invalide. Veuillez vous reconnecter';
      shouldClearCredentials = true;
    } else if (error.name === 'ConstraintError') {
      errorMessage = 'Contraintes d\'authentification non respectées';
    } else if (
      (error.message && error.message.toLowerCase().includes('something went wrong')) ||
      (error.message && error.message.toLowerCase().includes('unknown error')) ||
      (error.name === 'UnknownError')
    ) {
      errorMessage = 'Erreur d\'authentification système. Suppression de la configuration corrompue...';
      shouldClearCredentials = true;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Nettoyer l'état d'authentification et potentiellement les credentials
    setAuthenticated(false);
    
    if (shouldClearCredentials) {
      console.log('🧹 Nettoyage complet des credentials corrompus...');
      try {
        // Nettoyage complet pour résoudre les erreurs système
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('webauthn_credentials');
        localStorage.removeItem('webauthn_authenticated');
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem('webauthn_authenticated');
        sessionStorage.removeItem('webauthn_credentials');
      } catch (cleanupError) {
        console.error('❌ Erreur lors du nettoyage:', cleanupError);
      }
    }
    
    return { 
      success: false, 
      message: errorMessage,
      shouldReconfigure: shouldClearCredentials,
      errorDetails: {
        name: error.name,
        originalMessage: error.message
      }
    };
  }
};

/**
 * Vérifie si l'utilisateur a déjà configuré l'authentification biométrique
 */
export const hasBiometricSetup = () => {
  const credentials = getStoredCredentials();
  return credentials.length > 0;
};

/**
 * Supprime la configuration biométrique
 */
export const removeBiometricSetup = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    console.log('🗑️ Configuration biométrique supprimée');
    return { success: true, message: 'Configuration biométrique supprimée' };
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return { success: false, message: 'Erreur lors de la suppression' };
  }
};

/**
 * Déconnecte l'utilisateur (supprime l'état d'authentification local)
 */
export const logoutBiometric = () => {
  try {
    console.log('🚪 Déconnexion biométrique...');
    
    // Nettoyer l'état d'authentification
    setAuthenticated(false);
    
    // Nettoyer le sessionStorage pour éviter les conflits
    sessionStorage.removeItem(AUTH_KEY);
    
    console.log('✅ Déconnexion biométrique réussie');
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion biométrique:', error);
  }
};

/**
 * Force un nettoyage complet de l'état WebAuthn (en cas d'erreur système)
 */
export const forceCleanWebAuthnState = () => {
  try {
    console.log('🧹 Nettoyage forcé de l\'état WebAuthn...');
    
    // Nettoyer le localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('webauthn_credentials');
    localStorage.removeItem('webauthn_authenticated');
    
    // Nettoyer le sessionStorage
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem('webauthn_authenticated');
    sessionStorage.removeItem('webauthn_credentials');
    
    // Nettoyer l'état local
    setAuthenticated(false);
    
    console.log('✅ État WebAuthn nettoyé avec succès');
    return { success: true, message: 'État WebAuthn nettoyé' };
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage forcé:', error);
    return { success: false, message: 'Erreur lors du nettoyage' };
  }
};