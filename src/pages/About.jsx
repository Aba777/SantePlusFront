import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          A propos <span className="text-gray-700 font-medium">NOUS</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Bienvenu sur Santé+, votre partenaire de confiance dans la gestion
            de votre santé. Chez Santé+, nous comprenons vos difficultés
            lorsqu&#39il s&#39agit de trouver des solutions rapides, fiables et
            accessibles pour vos besoins médicaux.
          </p>
          <p>
            Notre plateforme est conçue pour simplifier la prise de rendez-vous
            médicaux, améliorer la communication entre les patients et les
            médecins, et garantir un suivi optimal de votre bien-être.
          </p>
          <b className="text-gray-800">Notre vision</b>
          <p>
            {" "}
            Notre vision est de révolutionner la gestion des soins de santé en
            intégrant technologie, accessibilité et fiabilité. Nous aspirons à
            devenir un acteur incontournable dans l&#39amélioration de la
            qualité de vie de nos utilisateurs grâce à des services innovants et
            personnalisés.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          POURQUOI SE TOURNER{" "}
          <span className="text-gray-700 font-semibold"> VERS NOUS ? </span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Expertise médicale à portée de main</b>
          <p>
            Santé+ vous connecte aux meilleurs professionnels de santé, offrant
            une expertise fiable et adaptée à vos besoins. Notre réseau regroupe
            des médecins qualifiés et des spécialistes reconnus.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Accès simplifié et rapide</b>
          <p>
            Nous avons conçu une plateforme intuitive qui vous permet de prendre
            rendez-vous en quelques clics. Plus de longues attentes, profitez
            d&#39un accès rapide à vos services de santé.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Suivi personnalisé</b>
          <p>
            Chez Santé+, chaque patient est unique. Nous vous offrons un suivi
            personnalisé grâce à des outils modernes qui facilitent la gestion
            de vos rendez-vous, consultations et documents médicaux.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
