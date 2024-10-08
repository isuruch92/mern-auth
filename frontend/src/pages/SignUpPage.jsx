import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { Mail, Lock, Loader, Backpack, User } from "lucide-react";

import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import GoogleLoginButton from "../components/GoogleLoginButton";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showStrengthMeter, setShowStrengthMeter] = useState(false);
  const navigate = useNavigate();

  const { signup, error, errorCode, isLoading, clearErrors } = useAuthStore();

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Only set showStrengthMeter to true if the user has typed something
    if (value.length > 0) {
      setShowStrengthMeter(true);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          ease: "linear",
        }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg relative"
      >
        {/* bg-gray-800 bg-opacity-50 */}

        <div className="p-8 pb-2">
          <div className="rounded-full bg-[#0B6FF4] w-[60px] h-[60px] flex justify-center items-center absolute top-[-30px] left-[calc(50%-30px)]">
            <Backpack
              className="mr-auto ml-auto text-white"
              size={36}
              absoluteStrokeWidth
            />
          </div>
          <h2 className="text-3xl font-bold mt-4 mb-8 text-center bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] text-transparent bg-clip-text">
            Create Account
          </h2>
          {/* from-green-400 to-emerald-500 */}
          {/* from-[#0B6FF4] to-[#0bbef4] */}

          {/* Google Login Button */}
          <div className="mt-4 mb-6">
            <GoogleLoginButton label="Sign up with Google" />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-gray-500">Or</span>
            </div>
          </div>

          <form onSubmit={handleSignUp}>
            <Input
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />

            {error && (
              <p className="text-red-500 font-semibold mt-2 text-sm">
                {error}&nbsp;
                {errorCode && (
                  <Link
                    to={"/verify-email"}
                    className="text-sm text-[#0B6FF4] hover:underline italic"
                  >
                    Go to verify email
                  </Link>
                )}
              </p>
            )}

            <AnimatePresence>
              {showStrengthMeter && (
                <motion.div
                  key="password-strength-meter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.4,
                  }}
                >
                  <PasswordStrengthMeter password={password} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] text-white 
						font-bold rounded-lg shadow-lg hover:from-[#095FD7] hover:to-[#1561B0] focus:outline-none 
            focus:ring-2 focus:ring-[#0b67e4] focus:ring-offset-2 focus:ring-offset-gray-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className=" animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
        </div>
        <div className="px-8 pt-4 pb-8 rounded-bl-[16px] rounded-br-[16px] bg-white flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to={"/login"} className="text-[#0B6FF4] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default SignUpPage;
