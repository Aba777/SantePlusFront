import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointments = () => {
  const { docId } = useParams();
  const { doctors, monnaie, backendUrl, token, getDoctorsData, userData } =
    useContext(AppContext);
  const joursSem = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  const getAvailableSlots = () => {
    if (!docInfo || !docInfo.slots_booked) return;
    setDocSlot([]);

    let now = new Date();
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(23, 0, 0, 0);

      // Commencer à 10h pour tous les jours
      let startTime = new Date(currentDate);
      startTime.setHours(10, 0, 0, 0);

      // Si c'est aujourd'hui, commencer après l'heure actuelle
      if (i === 0 && now.getHours() >= 10) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Arrondir à la prochaine demi-heure
        if (currentMinute > 30) {
          startTime.setHours(currentHour + 1, 0, 0, 0);
        } else if (currentMinute > 0) {
          startTime.setHours(currentHour, 30, 0, 0);
        } else {
          startTime.setHours(currentHour, 0, 0, 0);
        }
      }

      let timeSlots = [];
      let availableSlots = [];
      
      // Générer tous les créneaux pour le jour (disponibles et occupés)
      let slotTime = new Date(startTime);
      
      while (slotTime < endTime) {
        let formattedTime = slotTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = slotTime.getDate();
        let month = slotTime.getMonth() + 1;
        let year = slotTime.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        // Vérifier si le créneau est passé
        const isPast = slotTime <= now;
        
        // Vérifier si le créneau est déjà réservé
        const isSlotTaken = docInfo.slots_booked[slotDate]?.includes(formattedTime);

        const slotInfo = {
          datetime: new Date(slotTime),
          time: formattedTime,
          isTaken: isSlotTaken,
          isPast: isPast,
          isAvailable: !isSlotTaken && !isPast
        };

        timeSlots.push(slotInfo);
        
        if (slotInfo.isAvailable) {
          availableSlots.push(slotInfo);
        }

        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }

      // Si il y a des créneaux (disponibles ou non), on ajoute le jour
      if (timeSlots.length > 0) {
        setDocSlot((prev) => [...prev, timeSlots]);
      }
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Connectez-vous pour prendre rendez-vous");
      return navigate("/login");
    }

    if (!userData || !userData._id) {
      toast.error("Utilisateur non trouvé.");
      return;
    }

    if (!slotTime) {
      toast.error("Veuillez sélectionner un créneau horaire.");
      return;
    }

    // Vérifier si le créneau sélectionné est toujours available
    const selectedSlot = docSlot[slotIndex]?.find(slot => slot.time === slotTime);
    if (!selectedSlot || !selectedSlot.isAvailable) {
      toast.error("Ce créneau n'est plus disponible.");
      return;
    }

    try {
      const date = selectedSlot.datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime, userId: userData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Rendez-vous pris avec succès");
        getDoctorsData();
        
        
        navigate("/mes-rendez-vous");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={`http://localhost:4003${docInfo.image}`}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/** DocInfo... */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name} 
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
            </div>

            {/**Apropos du doc */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">A propos <img src={assets.info_icon} alt="" /></p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>
            <p className="text-gray-500 font-medium mt-4"> 
              Frais de consultation : <span className="text-gray-600">{docInfo.fees} {monnaie}</span>
            </p>
          </div>
        </div>

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Créneaux disponibles</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && joursSem[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot[slotIndex]
                .filter(item => !item.isPast) // Masquer les créneaux passés
                .map((item, index) => (
                <p
                  onClick={() => {
                    if (item.isAvailable) {
                      setSlotTime(item.time);
                    }
                  }}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full ${
                    item.isTaken
                      ? "text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed"
                      : item.time === slotTime
                      ? "bg-primary text-white cursor-pointer"
                      : item.isAvailable
                      ? "text-gray-400 border border-gray-300 cursor-pointer hover:border-primary hover:text-primary"
                      : "text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed"
                  }`}
                  title={item.isTaken ? "Créneau occupé" : item.isPast ? "Créneau passé" : "Disponible"}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Valider rendez-vous
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointments;
