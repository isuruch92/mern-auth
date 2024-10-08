import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

const GoogleLoginButton = ({ label }) => {
  const { googleLogin } = useAuthStore();

  const handleGoogleLoginSuccess = async (response) => {
    window.location.href = `${API_URL}/google`;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center justify-center w-full max-w-md p-3 font-medium max-h-[48px] 
      text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
      type="submit"
      onClick={handleGoogleLoginSuccess}
    >
      <img
        className="absolute left-4"
        src="./google-light.svg"
        alt="google logo"
      ></img>
      <span>{label}</span>
    </motion.button>
  );
};

export default GoogleLoginButton;
