import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  PiUserCircleThin,
  PiLockSimpleThin,
  PiEnvelopeThin,
  PiEyeThin,
  PiEyeSlashThin,
  PiPhoneThin,
  PiMapPinThin,
  PiImageThin,
  PiGenderIntersexThin,
  PiCalendarThin,
} from 'react-icons/pi';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [state, setState] = useState('Sign Up');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [image, setImage] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPasswordStrong = (pwd) => {
    const lengthOK = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return lengthOK && hasUpper && hasNumber && hasSpecial;
  };

  const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url =
        state === 'Sign Up'
          ? `${backendUrl}/api/user/register`
          : `${backendUrl}/api/user/login`;

      const payload =
        state === 'Sign Up'
          ? {
              name,
              email,
              password,
              phone,
              gender,
              dob,
              image,
              address: {
                line1: address1,
                line2: address2,
              },
            }
          : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-white to-slate-50"
    >
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white text-zinc-700 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-1 text-primary text-center">
          {state === 'Sign Up' ? "Créer un compte" : "Connexion"}
        </h2>
        <p className="text-center mb-6 text-sm text-zinc-500">
          {state === 'Sign Up'
            ? 'Inscrivez-vous pour accéder à Santé+'
            : 'Connectez-vous pour continuer'}
        </p>

        <div className="flex flex-col gap-4">
          {state === 'Sign Up' && (
            <>
              <Input icon={<PiUserCircleThin />} placeholder="Nom complet" value={name} setValue={setName} />
              <Input icon={<PiPhoneThin />} placeholder="Numéro de téléphone" value={phone} setValue={setPhone} />
              <div className="relative">
                <PiGenderIntersexThin className="absolute top-3 left-3 text-xl text-zinc-400" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="pl-10 w-full py-2 border rounded-md outline-primary text-zinc-500"
                  required
                >
                  <option value="" disabled>Genre</option>
                  <option value="masculin">Masculin</option>
                  <option value="feminin">Féminin</option>
                </select>
              </div>
              <Input icon={<PiCalendarThin />} type="date" placeholder="Date de naissance" value={dob} setValue={setDob} />
              <Input icon={<PiMapPinThin />} placeholder="Adresse - Ville/Region" value={address1} setValue={setAddress1} />
              <Input icon={<PiMapPinThin />} placeholder="Adresse - Quartier" value={address2} setValue={setAddress2} />
            </>
          )}

          <Input icon={<PiEnvelopeThin />} type="email" placeholder="Adresse email" value={email} setValue={setEmail} />

          <div className="relative group">
            <PiLockSimpleThin className="absolute top-3 left-3 text-xl text-zinc-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              className="pl-10 pr-10 w-full py-2 border rounded-md outline-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute top-3 right-3 text-xl text-zinc-400 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <PiEyeSlashThin /> : <PiEyeThin />}
            </span>

            {/* Tooltip */}
            <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded shadow text-xs p-3 hidden group-focus-within:block group-hover:block z-10">
              <p className={`${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                {password.length >= 8 ? '✔️' : '❌'} 8 caractères minimum
              </p>
              <p className={`${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                {/[A-Z]/.test(password) ? '✔️' : '❌'} Une majuscule
              </p>
              <p className={`${/\d/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                {/\d/.test(password) ? '✔️' : '❌'} Un chiffre
              </p>
              <p className={`${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                {/[^A-Za-z0-9]/.test(password) ? '✔️' : '❌'} Un caractère spécial
              </p>
            </div>
          </div>

          {/* Strength bar */}
          {state === 'Sign Up' && password && (
            <div className="h-2 w-full bg-gray-200 rounded-md overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-md ${
                  passwordStrength(password) === 4
                    ? 'bg-green-500 w-full'
                    : passwordStrength(password) === 3
                    ? 'bg-yellow-400 w-3/4'
                    : passwordStrength(password) === 2
                    ? 'bg-orange-400 w-1/2'
                    : 'bg-red-500 w-1/4'
                }`}
              ></div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (state === 'Sign Up' && !isPasswordStrong(password))}
            className={`${
              loading || (state === 'Sign Up' && !isPasswordStrong(password))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-green-700'
            } text-white py-2 rounded-md transition duration-200`}
          >
            {loading ? 'Chargement...' : state === 'Sign Up' ? 'Créer un compte' : 'Connexion'}
          </button>
        </div>

        <p className="text-center mt-6 text-sm">
          {state === 'Sign Up' ? (
            <>
              Déjà inscrit ?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-primary underline cursor-pointer"
              >
                Connectez-vous
              </span>
            </>
          ) : (
            <>
              Pas encore de compte ?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-primary underline cursor-pointer"
              >
                S&apos;inscrire
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

// ✅ Input réutilisable
const Input = ({ icon, placeholder, value, setValue, type = 'text' }) => (
  <div className="relative">
    {icon && <div className="absolute top-3 left-3 text-xl text-zinc-400">{icon}</div>}
    <input
      type={type}
      placeholder={placeholder}
      className="pl-10 w-full py-2 border rounded-md outline-primary"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required={placeholder !== 'photo de profile'}
    />
  </div>
);

export default Login;
