import React, {useContext} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";

const BonDocs = () => {

const navigate = useNavigate()
const  {doctors} = useContext(AppContext)

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-900 md:mx-10">
      <h1 className="text-2xl font-medium">Tous les médecins disponibles</h1>
      <p className="sm:w-1/3 text-center text-sm"> 
      Consultez notre liste complète de médecins disponibles.  
      Trouvez rapidement un professionnel de santé adapté à vos besoins.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0,10).map((item,index)=>(
          <div onClick={()=>navigate(`/rendez-vous/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" key={index}>
            <img className="bg-blue-50" src={`http://localhost:4003${item.image}`} alt="" />
            <div className="p-4">
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}  rounded-full`}></p><p>{item.available ? 'Disponible' : 'Indisponible'}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>{navigate(`/docteurs`); scrollTo(0,0)}} className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10">Voir Plus</button>
    </div>
  );
};

export default BonDocs;
