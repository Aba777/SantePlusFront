import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flew-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">
      {/*--------------Partie gauche--------------- */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md-mb-[-30]">
        <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold leading-tight md:leading-tight lg:leading-tight"> 
          Prenez rendez avec les meilleurs médecins de bamako
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img className="w-28" src={assets.group_profiles} alt="" />
          <p>Naviguez à travers la liste des médecins dispopnible, <br className="hidden sm:block" />Planifiez vos rendez-vous en un clic !</p>
        </div>
        <a href="#specialites" className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300">
          Prendre rendez-vous <img className="w-3" src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/*--------------Partie droite--------------- */}

      <div className="md:w-1/2 relative">
        <img className="w-full md:absolute bottom-0 h-auto rounded-lg" src={assets.header_img} alt="" />
      </div>
    </div>
  )
}

export default Header
