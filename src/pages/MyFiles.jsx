import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import { toast } from "react-toastify";
import BiometricAuth from "../components/BiometricAuth";
import { isAuthenticated, hasBiometricSetup, isWebAuthnSupported as checkWebAuthnSupport, logoutBiometric } from "../utils/webauthnLocal";

const MyFiles = () => {
  const { myMedicalFiles, getMyMedicalFiles, userData } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('auth'); // 'auth' ou 'setup'
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [hasRefusedAuth, setHasRefusedAuth] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    // Vérifier l'authentification biométrique au chargement
    checkBiometricAuth();
  }, []);

  const checkBiometricAuth = async () => {
    const webAuthnSupported = checkWebAuthnSupport();
    const hasSetup = hasBiometricSetup();
    const authenticated = isAuthenticated();

    // Réinitialiser l'état de refus au début de la vérification
    setHasRefusedAuth(false);

    if (webAuthnSupported && hasSetup && !authenticated) {
      // Si WebAuthn est supporté, qu'il y a une config, mais pas authentifié
      setShowBiometricAuth(true);
      setAuthMode('auth');
    } else if (webAuthnSupported && !hasSetup) {
      // Si WebAuthn est supporté mais pas de config
      setShowBiometricAuth(true);
      setAuthMode('setup');
    } else if (authenticated) {
      // Déjà authentifié
      setBiometricAuthenticated(true);
      loadFiles();
    } else {
      // Pas de support WebAuthn, chargement direct
      loadFiles();
    }
  };

  const loadFiles = () => {
    getMyMedicalFiles();
  };

  useEffect(() => {
    if (biometricAuthenticated) {
      loadFiles();
    }
  }, [biometricAuthenticated]);

  // Gestionnaires d'authentification biométrique
  const handleBiometricSuccess = () => {
    setBiometricAuthenticated(true);
    setShowBiometricAuth(false);
    setHasRefusedAuth(false); // Réinitialiser l'état de refus
    toast.success("Authentification réussie !");
  };

  const handleBiometricCancel = () => {
    if (authMode === 'setup') {
      // En mode setup, montrer l'avertissement de sécurité avant de fermer
      setShowSecurityWarning(true);
    } else {
      // En mode auth, refuser l'accès et fermer le modal
      setHasRefusedAuth(true);
      setShowBiometricAuth(false);
      toast.warn("Accès au dossier médical refusé pour des raisons de sécurité.");
    }
  };

  const handleSecurityWarningConfirm = () => {
    // L'utilisateur confirme qu'il veut continuer sans sécurité
    setShowSecurityWarning(false);
    setBiometricAuthenticated(true);
    setShowBiometricAuth(false);
    toast.info("Vous accédez à votre dossier sans authentification biométrique. Ceci n'est pas recommandé pour la sécurité de vos données médicales.");
  };

  const handleSecurityWarningCancel = () => {
    // L'utilisateur annule, on reste sur le modal de configuration
    setShowSecurityWarning(false);
  };

  const handleLogout = () => {
    logoutBiometric();
    setBiometricAuthenticated(false);
    setShowBiometricAuth(false);
    // Redéclencher la vérification d'authentification
    checkBiometricAuth();
  };

  const filteredFiles = myMedicalFiles.filter(
    (file) => !selectedCategory || file.category === selectedCategory
  );

  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadAllFiles = () => {
    if (filteredFiles.length === 0) {
      toast.warn("Aucun fichier à télécharger.");
      return;
    }

    filteredFiles.forEach((file, index) => {
      const link = document.createElement("a");
      link.href = file.fileUrl;
      link.download = file.fileName || `fichier-${index + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    toast.success("Téléchargement de tous les fichiers lancé.");
  };

  return (
    <>
      {/* Modal d'authentification biométrique */}
      {showBiometricAuth && (
        <BiometricAuth
          mode={authMode}
          onSuccess={handleBiometricSuccess}
          onCancel={handleBiometricCancel}
        />
      )}

      {/* Modal d'avertissement de sécurité */}
      {showSecurityWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Header avec gradient d'avertissement */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-t-2xl p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    ⚠️ Avertissement de sécurité
                  </h3>
                  <p className="text-orange-100 text-sm">
                    Accès non sécurisé au dossier médical
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Voulez-vous vraiment continuer sans authentification ?
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>🚫 <strong>Non recommandé :</strong> Vos données médicales ne seront pas protégées</p>
                    <p>⚠️ <strong>Risque :</strong> Accès non autorisé possible</p>
                    <p>🔒 <strong>Recommandé :</strong> Configurez l'authentification biométrique</p>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSecurityWarningCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Annuler - Configurer la sécurité
                </button>
                <button
                  onClick={handleSecurityWarningConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Continuer sans sécurité
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 px-4 py-8">
        {/* En-tête */}
        <header className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Mon Dossier Médical
              </h1>
              <p className="text-sm text-gray-600">
                Consultez vos documents médicaux en toute sécurité
              </p>
              {biometricAuthenticated && checkWebAuthnSupport() && (
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-green-600 font-medium">
                    Sécurisé par authentification biométrique
                  </span>
                </div>
              )}
            </div>
            {biometricAuthenticated && checkWebAuthnSupport() && hasBiometricSetup() && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                title="Se déconnecter de l'authentification biométrique"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            )}
          </div>
        </header>

      {/* Contenu principal - affiché seulement si authentifié, pas de WebAuthn, ou non refusé */}
      {(biometricAuthenticated || !checkWebAuthnSupport()) && !hasRefusedAuth && (
        <>
          {/* Filtrage */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 font-medium">
            Filtrer par catégorie :
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Toutes</option>
            <option value="Ordonnance">Ordonnance</option>
            <option value="Analyse">Analyse</option>
            <option value="Scanner">Scanner</option>
            <option value="Radio">Radio</option>
            <option value="Echographie">Echographie</option>
            <option value="IRM">IRM</option>
            <option value="Bilan">Bilan</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        {/* Bouton Télécharger Tout */}
        {filteredFiles.length > 0 && (
          <div className="mb-6">
            <button
              onClick={downloadAllFiles}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Télécharger tous les fichiers
            </button>
          </div>
        )}
      </div>

      {/* Affichage des fichiers */}
      {paginatedFiles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedFiles.map((file, index) => {
              const isImage = /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(
                file.fileUrl
              );
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img
                        src={file.fileUrl}
                        alt={file.fileName}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="text-indigo-500 text-sm font-semibold">
                        📄 Aperçu indisponible
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {file.fileName || `Fichier ${index + 1}`}
                    </h3>
                    <p className="text-xs text-gray-500">{file.category}</p>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-indigo-600 hover:underline mt-1"
                    >
                      Ouvrir le fichier
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur{" "}
              {Math.ceil(filteredFiles.length / itemsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredFiles.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(filteredFiles.length / itemsPerPage)
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm text-center mt-16">
          Aucun fichier médical trouvé. Vos documents s'afficheront ici une fois
          ajoutés par un médecin.
        </p>
      )}
        </>
      )}

      {/* Message d'attente si authentification en cours */}
      {showBiometricAuth && !biometricAuthenticated && !hasRefusedAuth && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Authentification requise
            </h3>
            <p className="text-gray-600">
              Veuillez vous authentifier pour accéder à votre dossier médical.
            </p>
          </div>
        </div>
      )}

      {/* Message d'accès refusé avec bouton pour réessayer */}
      {hasRefusedAuth && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Accès refusé
            </h3>
            <p className="text-gray-600 mb-6">
              L'authentification biométrique a été refusée. Vos données médicales ne sont pas accessibles pour des raisons de sécurité.
            </p>
            <button
              onClick={() => {
                setHasRefusedAuth(false);
                checkBiometricAuth(); // Relancer la vérification d'authentification
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Réessayer l'authentification</span>
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default MyFiles;
