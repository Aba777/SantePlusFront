import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/context";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("dob", userData.dob);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updatePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (data.success) {
        toast.success("Mot de passe mis à jour avec succès");
        setShowPasswordFields(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe");
      console.error(error);
    }
  };

  return (
    userData && (
      <section className="py-10 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-primary mb-8">Mon Profil</h2>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {isEdit ? (
              <label htmlFor="image" className="relative cursor-pointer group">
                <img
                  className="w-36 h-36 rounded-full object-cover opacity-80 group-hover:opacity-100 transition"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="avatar"
                />
                {!image && (
                  <img
                    src={assets.upload_icon}
                    alt="upload"
                    className="absolute bottom-2 right-2 w-8"
                  />
                )}
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  name="image"
                  hidden
                />
              </label>
            ) : (
              <img
                className="w-36 h-36 rounded-full object-cover"
                src={`http://localhost:4003/${userData.image}`}
                alt="avatar"
              />
            )}
          </div>

          {/* Info Form */}
          <div className="flex-1 w-full">
            {/* Name */}
            <div className="mb-4">
              {isEdit ? (
                <input
                  type="text"
                  className="text-2xl font-semibold text-gray-800 bg-gray-100 p-2 rounded w-full"
                  value={userData.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <h3 className="text-2xl font-semibold text-gray-800">{userData.name}</h3>
              )}
            </div>

            {/* Contacts */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-600 mb-2">Contacts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-blue-600 font-medium break-words">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  {isEdit ? (
                    <input
                      type="text"
                      className="bg-gray-100 p-2 rounded w-full"
                      value={userData.phone}
                      onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <p className="text-blue-500 font-medium">{userData.phone}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Adresse</p>
                  {isEdit ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="bg-gray-100 p-2 rounded w-full"
                        value={userData.address.line1}
                        onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                      />
                      <input
                        type="text"
                        className="bg-gray-100 p-2 rounded w-full"
                        value={userData.address.line2}
                        onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {userData.address.line1}<br />
                      {userData.address.line2}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Base Info */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-600 mb-2">Informations personnelles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Sexe</p>
                  {isEdit ? (
                    <select
                      className="bg-gray-100 p-2 rounded w-full"
                      value={userData.gender}
                      onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="Masculin">Masculin</option>
                      <option value="Feminin">Feminin</option>
                    </select>
                  ) : (
                    <p className="text-gray-600">{userData.gender}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  {isEdit ? (
                    <input
                      type="date"
                      className="bg-gray-100 p-2 rounded w-full"
                      value={userData.dob}
                      onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                    />
                  ) : (
                    <p className="text-gray-600">{userData.dob}</p>
                  )}
                </div>
              </div>
            </div>

            {/* CHANGEMENT DE MOT DE PASSE */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-medium text-gray-700">Sécurité</label>
                <button
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showPasswordFields ? 'Annuler' : 'Changer le mot de passe'}
                </button>
              </div>
              
              {showPasswordFields && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Mot de passe actuel</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full bg-white p-3 rounded border border-gray-300 focus:border-primary focus:outline-none"
                      placeholder="Votre mot de passe actuel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full bg-white p-3 rounded border border-gray-300 focus:border-primary focus:outline-none"
                      placeholder="Nouveau mot de passe (min. 6 caractères)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full bg-white p-3 rounded border border-gray-300 focus:border-primary focus:outline-none"
                      placeholder="Confirmer le nouveau mot de passe"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={updatePassword}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mettre à jour le mot de passe
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
                onClick={isEdit ? updateUserProfileData : () => setIsEdit(true)}
              >
                {isEdit ? "Enregistrer" : "Modifier"}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default MyProfile;
