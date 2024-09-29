import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader, Backpack } from "lucide-react";

import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

function LoginPage() {
  const [email, setEmail] = useState("isuruch92@gmail.com");
  const [password, setPassword] = useState("54321");

  const { login, isLoading, error, clearErrors } = useAuthStore();

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    // dark => bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl
    // light => bg-white
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
      <div className="p-8 pb-2">
        <div className="rounded-full bg-[#0B6FF4] w-[60px] h-[60px] flex justify-center items-center absolute top-[-30px] left-[calc(50%-30px)]">
          <Backpack
            className="mr-auto ml-auto text-white"
            size={36}
            absoluteStrokeWidth
          />
        </div>

        {/* bg-gradient-to-r from-green-400 to-emerald-500 
            bg-gradient-to-r from-[#0B6FF4] to-[#1976d2]   */}
        <h2 className="text-3xl font-bold mt-4 mb-8 text-center bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
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
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-[#0B6FF4] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="text-red-500 font-semibold mb-2 text-sm">{error}</p>
          )}

          {/* bg-gradient-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700 
              focus:ring-green-500 focus:ring-offset-gray-900

              bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] 
              hover:from-[#095FD7] hover:to-[#1561B0]
              focus:ring-[#0b67e4] focus:ring-offset-gray-200   */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] 
            text-white font-bold rounded-lg shadow-lg hover:from-[#095FD7] hover:to-[#1561B0] 
            focus:outline-none focus:ring-2 focus:ring-[#0b67e4] focus:ring-offset-2 
            focus:ring-offset-gray-200 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      {/* dark=> bg-gray-900 bg-opacity-50
          light => bg-white*/}
      <div className="px-8 pt-4 pb-8 rounded-bl-[16px] rounded-br-[16px] bg-white flex justify-center">
        {/* dark=> text-gray-400
          light => text-gray-600*/}
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-[#0B6FF4] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default LoginPage;
