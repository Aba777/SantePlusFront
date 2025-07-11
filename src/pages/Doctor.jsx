import React, { useContext, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/context'
import { NavLink, useNavigate } from "react-router-dom";

const Doctor = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const [filterDoc,setFilterDoc] = useState([])
  const [showFilter,setShowFilter ] =useState(false)
  const navigate = useNavigate()

  const applyFilter = ()=>{
    if(speciality){
      setFilterDoc(doctors.filter(doc=>doc.speciality===speciality))
    }else{
      setFilterDoc(doctors)
    }
  }

  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])
 
  return (
    <div>
      <p>Spécialités disponibles</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button className={`py-1 px-3 border rounded text:sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>setShowFilter(prev => !prev)}>Filtrer</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={()=> speciality === '' ? navigate('/docteurs') : navigate('/docteurs/Généraliste')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Généraliste" ? "bg-indigo-100 text-black" : ""}`}>Médecin Généraliste</p>
          <p onClick={()=> speciality === '' ? navigate('/docteurs') : navigate('/docteurs/Gynécologue')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynécologue" ? "bg-indigo-100 text-black" : ""}`}>Gynécologue</p>
          <p onClick={()=> speciality === '' ? navigate('/docteurs') : navigate('/docteurs/Dermatologue')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologue" ? "bg-indigo-100 text-black" : ""}`}>Dermatologue</p>
          <p onClick={()=> speciality === '' ? navigate('/doctors') : navigate('/docteurs/Pédiatre')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pédiatre" ? "bg-indigo-100 text-black" : ""}`}>Pédiatre</p>
          <p onClick={()=> speciality === '' ? navigate('/docteurs') : navigate('/docteurs/Neurologue')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologue" ? "bg-indigo-100 text-black" : ""}`}>Neurologue</p>
          <p onClick={()=> speciality === '' ? navigate('/docteurs') : navigate('/docteurs/Gastro-entérologue')} className={`w-[94w] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastro-entérologue" ? "bg-indigo-100 text-black" : ""}`}>Gastro-entérologue</p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6"> 
        {
        filterDoc.map((item,index)=>(
          <div onClick={()=>{navigate(`/rendez-vous/${item._id}`); scrollTo(0,0)}} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" key={index}>
            <img className="bg-blue-50" src={`http://localhost:4003${item.image}`} alt="" />
            <div className="p-4">
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}  rounded-full`}></p><p>{item.available ? 'Disponible' : 'Indisponible'}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))
      }
        </div>
      </div>
      
    </div>
  )
}

export default Doctor
