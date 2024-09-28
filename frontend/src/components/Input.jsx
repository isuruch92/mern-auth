import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ icon: Icon, ...props }) => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    setToggle((t) => !t);
  };

  return (
    <div className="relative mb-4 h-11 flex">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-[#0B6FF4]" />
      </div>

      {/* 
       dark:=> bg-gray-800 bg-opacity-50 border-gray-700 focus:border-green-500 

       light:=> bg-white border-slate-400 focus:border-[#0B6FF4] focus:ring-green-500 text-black 
      */}
      <input
        {...props}
        type={props.type === "password" && toggle ? "text" : props.type}
        className="w-full pl-10 pr-3 py-2 text-sm bg-white rounded-lg border outline-none 
        border-slate-400 focus:border-[#0B6FF4] focus:ring-1 focus:ring-[#0B6FF4]  text-black
        placeholder-gray-400 transition duration-200"
      />
      {props.type === "password" && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 "
          onClick={handleToggle}
        >
          {toggle ? (
            <Eye className="p-1 size-8 text-[#0B6FF4] hover:bg-slate-200 rounded-full" />
          ) : (
            <EyeOff className="p-1 size-8 text-[#0B6FF4] hover:bg-slate-200 rounded-full" />
          )}
        </button>
      )}
    </div>
  );
};
export default Input;
