import React from 'react'
import { specialityData } from "../assets/assets"
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800" id="specialites">
      <h1 className="text-2xl font-medium">Cherchez par spécialités</h1>
      <p className="sm:w-1/3 text-center text-sm"> Parcourez notre liste de spécialités médicales pour trouver celle qui vous convient.  
      Accédez aux meilleurs experts et prenez rendez-vous en toute simplicité. </p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {specialityData.map((item,index)=>(
            <Link onClick={()=>scrollTo(0,0)} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 " key={index} to={`/docteurs/${item.speciality}`}>
              <img className="w-16 m:w-24 mb-2" src={item.image} alt="" />
                <p>{item.speciality}</p>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu
