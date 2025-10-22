import { useState, useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, userData, logout } = useContext(AppContext);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Fermer dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">Accueil</li>
        </NavLink>
        <NavLink to="/docteurs">
          <li className="py-1">Tous les docteurs</li>
        </NavLink>
        <NavLink to="/à-propos">
          <li className="py-1">À propos</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Nous contacter</li>
        </NavLink>
      </ul>

      <div className="flex items-center">
        {token && userData ? (
          <div
            ref={dropdownRef}
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500 shadow"
              src={
                userData.image
                  ? `http://localhost:4003/${userData.image}`
                  : assets.default_profile
              }
              alt="Profil"
            />
            <img
              className={`w-3 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              src={assets.dropdown_icon}
              alt="Dropdown"
            />

            {showDropdown && (
              <div
                className="absolute right-0 top-full mt-3 w-56 transition-all duration-300 ease-out origin-top-right 
                backdrop-blur-md bg-white/70 shadow-xl rounded-xl z-40 border border-indigo-100"
              >
                <ul className="py-3 px-4 text-sm text-gray-700 font-medium space-y-2">
                  <li
                    onClick={() => {
                      navigate("/mon-profile");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 17.804A6.997 6.997 0 0112 15a6.997 6.997 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Mon profil
                  </li>
                  <li
                    onClick={() => {
                      navigate("/mes-rendez-vous");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M9 19h6"
                      />
                    </svg>
                    Mes rendez-vous
                  </li>
                  <li
                    onClick={() => {
                      navigate("/mon-dossier");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.5l1-1h2l1 1H17a2 2 0 012 2v12a2 2 0 01-2 2z"
                      />
                    </svg>
                    Mon dossier
                  </li>
                  <li
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-red-100 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                      />
                    </svg>
                    Se déconnecter
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Créer un compte
          </button>
        )}

        {/* Menu mobile */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="Menu"
        />
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Fermer"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Accueil</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/docteurs">
              <p className="px-4 py-2 rounded inline-block">
                Tous les docteurs
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/à-propos">
              <p className="px-4 py-2 rounded inline-block">À propos</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Nous contacter</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/mon-dossier">
              <p className="px-4 py-2 rounded inline-block">Mon dossier</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
