import React, { useState } from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleUnavailableClick = () => {
    setShowModal(true);
  };

  return (
    <footer className="bg-white border-t pt-16 pb-8 px-6 md:px-16 text-zinc-700 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Logo & description */}
        <div className="md:col-span-2">
          <img src={assets.logo} alt="Santé+" className="w-36 mb-4" />
          <p className="text-zinc-600 leading-6 max-w-md">
            Une santé entre de bonnes mains. Accédez facilement à des
            spécialistes qualifiés et gérez vos rendez-vous en toute simplicité.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h4 className="text-md font-semibold mb-4 text-neutral-800">
            Liens utiles
          </h4>
          <ul className="space-y-2 text-zinc-600">
            <li className="hover:text-black cursor-pointer transition">
              Accueil
            </li>
            <li
              onClick={handleUnavailableClick}
              className="hover:text-black cursor-pointer transition"
            >
              Services
            </li>
            <li
              onClick={handleUnavailableClick}
              className="hover:text-black cursor-pointer transition"
            >
              Assistance
            </li>
            <li
              onClick={handleUnavailableClick}
              className="hover:text-black cursor-pointer transition"
            >
              Mentions légales
            </li>
          </ul>
        </div>

        {/* Contact & Réseaux */}
        <div>
          <h4 className="text-md font-semibold mb-4 text-neutral-800">
            Contact
          </h4>
          <p className="mb-2 text-zinc-600">📞 +223 75 90 68 91</p>
          <p className="mb-4 text-zinc-600">📧 internetface25@gmail.com</p>
          <div className="flex gap-3 text-zinc-500 text-lg mt-2">
            <i className="pi pi-facebook hover:text-blue-600 cursor-pointer transition" />
            <i className="pi pi-twitter hover:text-sky-500 cursor-pointer transition" />
            <i className="pi pi-linkedin hover:text-blue-700 cursor-pointer transition" />
            <i className="pi pi-youtube hover:text-red-600 cursor-pointer transition" />
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="text-center mt-12 border-t pt-5 text-xs text-zinc-400">
        © {new Date().getFullYear()} Santé+ — Conçu avec ❤️ pour une meilleure
        santé.
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-3xl w-full p-10 rounded-xl shadow-2xl text-center"
          >
            <img
              src={assets.maintain} // Ton image personnalisée
              alt="Service indisponible"
              className="w-80 mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold mb-4 text-zinc-800">
              Service temporairement indisponible
            </h2>
            <p className="text-base text-zinc-600 mb-6">
              Cette fonctionnalité est actuellement en maintenance. Veuillez
              réessayer plus tard ou nous contacter si besoin.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-neutral-800 text-white px-6 py-3 rounded hover:bg-neutral-700 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
