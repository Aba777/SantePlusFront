import React from 'react'
import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/*-------- Section Gauche --------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil ullam, sit repellat, quidem officiis eum quibusdam fugiat excepturi, eius doloremque commodi rerum! Inventore nemo totam soluta quae tempora officiis ea.</p>
        </div>

        {/*-------- Section Centre --------- */}
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Conctact us</li>
            <li>Privacy policy </li>
          </ul>
        </div>

        {/*-------- Section Droite --------- */}
        <div>
          <p className="text-xl font-medium mb-5">A votre portée</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+223-75-90-68-91</li>
            <li>internetface25@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2025@ Santé+ - Tous droits Réservés</p>
      </div>
    </div>
  )
}

export default Footer
