import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/"><li className="py-1">Accueil</li></NavLink>
        <NavLink to="/docteurs"><li className="py-1">Tous les docteurs</li></NavLink>
        <NavLink to="/à-propos"><li className="py-1">À propos</li></NavLink>
        <NavLink to="/contact"><li className="py-1">Nous contacter</li></NavLink>
      </ul>
      <div className="flex items-center">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={userData.image ? `http://localhost:4003/${userData.image}` : assets.default_profile}
              alt="Profil"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={() => navigate("mon-profile")} className="hover:text-black cursor-pointer">Mon profil</p>
                <p onClick={() => navigate("mes-rendez-vous")} className="hover:text-black cursor-pointer">Mes rendez-vous</p>
                <p onClick={logout} className="hover:text-black cursor-pointer">Se déconnecter</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Créer un compte
          </button>
        )}
        <img onClick={() => setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="Menu" />
        {/* Menu téléphone */}
        <div className={`${showMenu ? "fixed w-full" : "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img className="w-7" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Fermer" />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/"><p className="px-4 py-2 rounded inline-block">Accueil</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/docteurs"><p className="px-4 py-2 rounded inline-block">Tous les docteurs</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/à-propos"><p className="px-4 py-2 rounded inline-block">À propos</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className="px-4 py-2 rounded inline-block">Nous contacter</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
