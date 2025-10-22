import React, { useState, useEffect } from 'react';
import { 
  isWebAuthnSupported, 
  authenticateBiometric, 
  registerBiometric, 
  hasBiometricSetup, 
  removeBiometricSetup,
  isAuthenticated 
} from '../utils/webauthnLocal';

const BiometricAuth = ({ onSuccess, onCancel, mode = 'auth' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [hasSetup, setHasSetup] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    // Synchroniser le mode avec les props
    setCurrentMode(mode);
  }, [mode]);

  useEffect(() => {
    // Vérifier le support et la configuration
    const supported = isWebAuthnSupported();
    const setup = hasBiometricSetup();
    const authenticated = isAuthenticated();

    setIsSupported(supported);
    setHasSetup(setup);

    if (authenticated && currentMode === 'auth') {
      onSuccess();
    }
  }, [currentMode, onSuccess]);

  const handleAuthenticate = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await authenticateBiometric();
      
      if (result.success) {
        setMessage('✅ Authentification réussie !');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setError(result.message);
        
        // Si une reconfiguration est nécessaire, mettre à jour l'état
        if (result.shouldReconfigure) {
          console.log('🔄 Reconfiguration nécessaire après erreur système');
          setHasSetup(false);
          setCurrentMode('setup');
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur d\'authentification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await registerBiometric();
      
      if (result.success) {
        setMessage('✅ Configuration réussie !');
        setHasSetup(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Erreur de configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSetup = async () => {
    setIsLoading(true);
    setError('');
    
    const result = removeBiometricSetup();
    
    if (result.success) {
      setHasSetup(false);
      setMessage('Configuration supprimée');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  // Vérifications préliminaires
  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Authentification non supportée
            </h3>
            <p className="text-gray-600 mb-4">
              Votre navigateur ne prend pas en charge l'authentification biométrique.
            </p>
            <button
              onClick={onCancel}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continuer sans authentification
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {currentMode === 'auth' ? 'Authentification' : 'Configuration'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {currentMode === 'auth' ? 'Accès sécurisé au dossier médical' : 'Configuration de l\'authentification biométrique'}
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {currentMode === 'auth' ? (
            // Mode authentification
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirmez votre identité
                </h4>
                <p className="text-gray-600 text-sm">
                  Utilisez votre empreinte digitale, reconnaissance faciale ou autre authentification biométrique configurée.
                </p>
              </div>

              <button
                onClick={handleAuthenticate}
                disabled={isLoading || !hasSetup}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>S'authentifier</span>
                  </>
                )}
              </button>

              {!hasSetup && (
                <p className="text-sm text-gray-500">
                  Aucune authentification biométrique configurée. Configurez d'abord votre authentification.
                </p>
              )}
            </div>
          ) : (
            // Mode configuration
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {hasSetup ? 'Authentification configurée' : 'Configurer l\'authentification'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {hasSetup 
                    ? 'Vous avez déjà configuré l\'authentification biométrique.' 
                    : 'Configurez votre empreinte digitale ou reconnaissance faciale pour sécuriser l\'accès à votre dossier médical.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                {!hasSetup ? (
                  <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Configuration...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        <span>Configurer</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveSetup}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Suppression...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Supprimer la configuration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {onCancel && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onCancel}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricAuth;
