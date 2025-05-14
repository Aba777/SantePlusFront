import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
        CONTACTEZ <span className="text-gray-700 font-semibold">NOUS</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img className="w-full md:max-w-[360px]" src={assets.contact_image} alt="" />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600"> Où nous trouver</p>
          <p className="text-gray-500"></p>
          <p className="text-gray-500"> </p>
          <p className="font-semibold text-lg text-gray-600">Une carrière chez nous ?</p>
          <p className="text-gray-500"> Apprennez plus sur nous équipes et opportunités</p>
          <button className="border border-black px-8 py-4 text-sm"> Voir les offres </button>
        </div>

      </div>
    </div>
  )
}

export default Contact
