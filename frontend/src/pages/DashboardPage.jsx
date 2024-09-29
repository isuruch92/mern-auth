import { motion } from "framer-motion";
import { formatDate } from "../utils/date";
import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    // dark => bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg border-gray-800
    // light => bg-white
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] text-transparent bg-clip-text">
        Dashboard
      </h2>

      <div className="space-y-6">
        {/* dark => bg-gray-800 bg-opacity-50 border-gray-700 
         light => bg-white border-gray-300*/}
        <motion.div
          className="p-4 bg-white bg-opacity-50 rounded-lg border border-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-[#1976d2] mb-3">
            Profile Information
          </h3>
          {/* dark => text-gray-300
              light => text-gray-700*/}
          <p className="text-gray-700">
            <span className="font-bold">Name:</span> {user.name}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Email:</span> {user.email}
          </p>
        </motion.div>
        <motion.div
          className="p-4 bg-white border-gray-300 rounded-lg border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-[#1976d2] mb-3">
            Account Activity
          </h3>
          <p className="text-gray-700">
            <span className="font-bold">Joined: </span>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Last Login: </span>

            {formatDate(user.lastLogin)}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] text-white 
				font-bold rounded-lg shadow-lg hover:from-[#095FD7] hover:to-[#1561B0]
				 focus:outline-none focus:ring-2 focus:ring-[#0b67e4] focus:ring-offset-2 focus:ring-offset-gray-200"
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
export default DashboardPage;
