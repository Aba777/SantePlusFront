import React from "react";
import { Card } from "primereact/card";
import { Ripple } from "primereact/ripple";
import { assets } from "../assets/assets";
import { FaHeartbeat, FaClock, FaUserCheck } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 py-16 px-6 md:px-20 overflow-hidden relative">
      {/* === Hero Section === */}
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-800 drop-shadow-sm">
          À propos <span className="text-primary">de Santé+</span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Nous combinons technologie et accompagnement humain pour vous offrir une plateforme médicale fluide, fiable et humaine.
        </p>
      </div>

      {/* === Core Content === */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-14">
        {/* Text Section */}
        <div className="flex flex-col gap-6 text-[15px] text-gray-700 leading-relaxed md:w-2/3">
          <p>
            Chez <span className="font-semibold text-primary">Santé+</span>, nous sommes convaincus que chaque patient mérite un accès rapide à des soins de qualité. Notre plateforme simplifie la prise de rendez-vous, favorise la communication patient-médecin, et garantit un suivi personnalisé.
          </p>
          <p>
            Que vous soyez en ville ou en zone éloignée, notre réseau de professionnels qualifiés vous est accessible en quelques clics.
          </p>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Notre vision</h3>
            <p>
              Offrir une santé plus proche, plus intelligente, plus humaine. Nous souhaitons devenir un acteur de référence dans la e-santé africaine.
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/3 animate-fade-in-up">
          <img
            src={assets.about_image}
            alt="santé+"
            className="rounded-2xl shadow-xl w-full max-w-xs mx-auto"
          />
        </div>
      </div>

      {/* === Pourquoi nous === */}
      <div className="mt-24 text-center">
        <h3 className="text-3xl font-semibold text-zinc-800 mb-2">Pourquoi choisir <span className="text-primary">Santé+</span> ?</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Nos engagements s'appuient sur la qualité, l’accessibilité et la confiance.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: <FaHeartbeat />,
            title: "Expertise médicale",
            text: "Des praticiens certifiés et reconnus pour un accompagnement de qualité.",
          },
          {
            icon: <FaClock />,
            title: "Réservation rapide",
            text: "Prenez rendez-vous en quelques clics, sans attente.",
          },
          {
            icon: <FaUserCheck />,
            title: "Suivi intelligent",
            text: "Vos données de santé organisées, accessibles et sécurisées.",
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-white/70 backdrop-blur-lg border border-zinc-200 shadow-md rounded-xl transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <div className="p-5">
              <div className="text-4xl text-primary mb-4">{item.icon}</div>
              <h4 className="text-lg font-semibold text-zinc-800 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
            <Ripple />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default About;
