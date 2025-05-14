import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/context";
import { assets } from "../assets/assets";
import {toast} from 'react-toastify'
import axios from 'axios'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('dob', userData.dob)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)

      image && formData.append('image', image)

      const {data} = await axios.post(backendUrl + '/api/user/update-profile', formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    
    if (data.success) {
      toast.success(data.message)
      await loadUserProfileData()
      setIsEdit(false)
      setImage(false)
    } else {
      toast.error(data.message)
    }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  console.log(userData);

  useEffect(() => {
    console.log("Données utilisateur :", userData);
  }, [userData]);

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? 
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
              className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img className="w-10 absolute bottom-12 right-12" src={image ? "" : assets.upload_icon} alt="" />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              name="image"
              hidden
            />
          </label>
         : 
          <img className="w-36 rounded" src={`http://localhost:4003/${userData.image}`} alt="" />
        }

        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}
        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline mt-3"> CONTACTS</p>
          <di className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium"> Mon email :</p>
            <p className="text-blue-500">{userData.email}</p>
            <p className="font-medium">Mon numéro</p>
            {isEdit ? (
              <input
                type="text"
                className="bg-gray-100 max-w-52"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}
            <p className="font-medium">Mon adresse</p>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-50"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={userData.address.line1}
                  type="text"
                />
                <br />
                <input
                  className="bg-gray-50"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={userData.address.line2}
                  type="text"
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </di>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-3">
            Informations de base
          </p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium"> Sexe :</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Feminin</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}
            <p>Date de Naissance :</p>
            {isEdit ? (
              <input
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob}
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={updateUserProfileData}
            >
              {" "}
              Enregistrer{" "}
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-2 rounded-full  hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              {" "}
              Modifier{" "}
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
