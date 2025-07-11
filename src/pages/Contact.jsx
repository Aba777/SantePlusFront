import React from "react";
import { assets } from "../assets/assets";
import { FiMapPin, FiPhone, FiMail, FiBriefcase } from "react-icons/fi";
import { Card } from "primereact/card";
import { Ripple } from "primereact/ripple";

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 md:px-20 py-16 overflow-hidden">
      {/* === Hero Section === */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-800">
          Contactez <span className="text-primary">Nous</span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Une question ? Un besoin ? Nous sommes à votre écoute. Que ce soit pour des renseignements ou une collaboration, n’hésitez pas.
        </p>
      </div>

      {/* === Main Section === */}
      <div className="flex flex-col md:flex-row items-center gap-14 mb-24">
        {/* Image */}
        <div className="md:w-1/3 animate-fade-in-up">
          <img
            src={assets.contact_image}
            alt="contact"
            className="rounded-2xl shadow-lg w-full max-w-xs mx-auto"
          />
        </div>

        {/* Infos */}
        <div className="grid gap-6 text-sm md:w-2/3 text-gray-700">
          {/* Adresse */}
          <div className="flex items-start gap-4">
            <div className="text-xl text-primary mt-1">
              <FiMapPin />
            </div>
            <div>
              <p className="font-semibold text-zinc-800">Adresse</p>
              <p>Hippodrome Rue 428, Bamako, Mali</p>
            </div>
          </div>

          {/* Téléphone */}
          <div className="flex items-start gap-4">
            <div className="text-xl text-primary mt-1">
              <FiPhone />
            </div>
            <div>
              <p className="font-semibold text-zinc-800">Téléphone</p>
              <p>+223 75 90 68 91</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="text-xl text-primary mt-1">
              <FiMail />
            </div>
            <div>
              <p className="font-semibold text-zinc-800">Email</p>
              <p>internetface25@gmail.com</p>
            </div>
          </div>

          {/* Recrutement */}
          <div className="flex items-start gap-4">
            <div className="text-xl text-primary mt-1">
              <FiBriefcase />
            </div>
            <div>
              <p className="font-semibold text-zinc-800">Carrière</p>
              <p>Envie de nous rejoindre ? Découvrez nos offres d’emploi !</p>
              <button className="mt-3 bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition">
                Voir les offres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === CTA ou Simulated Form === */}
      <Card className="bg-white/80 backdrop-blur-lg border border-zinc-200 rounded-xl text-center p-8 shadow-md max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-zinc-800 mb-2">Une demande spécifique ?</h3>
        <p className="text-gray-600 mb-4">Notre équipe vous répondra dans les meilleurs délais.</p>
        <button className="bg-zinc-800 text-white px-6 py-2 rounded hover:bg-zinc-700 transition">
          Envoyer un message
        </button>
        <Ripple />
      </Card>
    </div>
  );
};

export default Contact;
