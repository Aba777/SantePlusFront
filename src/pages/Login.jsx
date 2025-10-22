import { useState, useContext, useEffect } from 'react';
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
  const [image] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

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
    
    if (state === 'Sign Up' && !acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation');
      return;
    }
    
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
              acceptedTerms: acceptTerms,
            }
          : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        if (state === 'Sign Up') {
          // Inscription réussie, afficher le modal OTP
          setPendingEmail(email);
          setShowOTPModal(true);
          toast.success('Code de validation envoyé! Vérifiez votre email.');
        } else {
          // Connexion réussie
          if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            toast.success('Connexion réussie!');
          } else if (data.needsVerification) {
            // Le compte n'est pas vérifié
            setPendingEmail(data.email);
            setShowOTPModal(true);
            toast.info(data.message);
          }
        }
      } else {
        if (data.needsVerification) {
          setPendingEmail(data.email);
          setShowOTPModal(true);
        }
        toast.error(data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email: forgotPasswordEmail
      });

      if (data.success) {
        toast.success('Email de récupération envoyé! Vérifiez votre boîte mail.');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Veuillez entrer un code OTP valide');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email: pendingEmail,
        otpCode: otpCode
      });

      if (data.success) {
        toast.success(data.message);
        setShowOTPModal(false);
        setOtpCode('');
        setPendingEmail('');
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la validation du code');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
      // S'assurer qu'on arrive en haut de page
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [token, navigate]);

  return (
    <>
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

            {/* Checkbox pour l'acceptation des conditions */}
            {state === 'Sign Up' && (
              <div className="flex items-start mt-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="acceptTerms" className="text-sm text-zinc-600">
                  J`accepte les{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary underline hover:text-green-700 focus:outline-none"
                  >
                    conditions d`utilisation
                  </button>
                </label>
              </div>
            )}

            {/* Lien mot de passe oublié pour la connexion */}
            {state === 'Login' && (
              <p className="text-center text-sm text-zinc-500">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-primary underline hover:text-green-700"
                >
                  Mot de passe oublié ?
                </button>
              </p>
            )}

            <button
              type="submit"
              disabled={loading || (state === 'Sign Up' && (!isPasswordStrong(password) || !acceptTerms))}
              className={`${
                loading || (state === 'Sign Up' && (!isPasswordStrong(password) || !acceptTerms))
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
                  S`;inscrire
                </span>
              </>
            )}
          </p>
        </div>
      </form>

      {/* Modal des conditions d'utilisation */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-primary">Conditions d`Utilisation et Protection des Données</h3>
            
            <div className="text-sm text-zinc-600 space-y-3">
              <p>
                En cochant cette case, vous acceptez que vos données personnelles soient traitées 
                par Santé+ dans le cadre de la gestion de vos rendez-vous médicaux et de votre suivi santé.
              </p>
              
              <p>
                <strong>Données collectées :</strong> Nom, email, téléphone, adresse, date de naissance, 
                genre, et informations médicales nécessaires à votre prise en charge.
              </p>
              
              <p>
                <strong>Finalités :</strong> Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-5">
                <li>La prise de rendez-vous avec des professionnels de santé</li>
                <li>L`envoi de rappels et confirmations de rendez-vous</li>
                <li>La facturation des consultations</li>
                <li>Le suivi médical dans le respect du secret professionnel</li>
              </ul>
              
              <p>
                <strong>Vos droits :</strong> Conformément au RGPD, vous disposez des droits d`accès, 
                de rectification, d`opposition et d`effacement de vos données.
              </p>
              
              <p className="font-semibold">
                Pour exercer vos droits ou pour toute question relative à la protection de vos données, 
                veuillez contacter notre support client à l`adresse : support@sante-plus.com
              </p>
              
              <p>
                Nous nous engageons à protéger vos données et à ne les utiliser que dans le cadre 
                strict des services que vous sollicitez.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                J`ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal récupération de mot de passe */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Mot de passe oublié</h3>
            
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary focus:outline-none"
                  placeholder="Votre adresse email"
                  required
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal validation OTP */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Validation email</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Nous avons envoyé un code à 6 chiffres à <strong>{pendingEmail}</strong>. 
              Entrez ce code ci-dessous pour finaliser votre inscription.
            </p>
            
            <form onSubmit={handleOTPVerification}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de validation
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-primary focus:outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowOTPModal(false);
                    setOtpCode('');
                    setPendingEmail('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Validation...' : 'Valider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// ✅ Input réutilisable
// eslint-disable-next-line react/prop-types
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