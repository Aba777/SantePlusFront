import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import { toast } from "react-toastify";

const MyFiles = () => {
  const { myMedicalFiles, getMyMedicalFiles } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    getMyMedicalFiles();
  }, []);

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
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 px-4 py-8">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Mes Dossiers Médicaux
        </h1>
        <p className="text-sm text-gray-600">
          Consultez vos documents médicaux en toute sécurité
        </p>
      </header>

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
              📥 Télécharger tous les fichiers
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
    </div>
  );
};

export default MyFiles;
