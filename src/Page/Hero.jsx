import { ClipboardCheck } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import demoImage from "../assets/image.png";
const Hero = () => {
  return (
    <div className="relative min-h-screen bg-[#F9FAFB] p-6 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3">
        <div className="w-96 h-96 bg-red-200 rounded-full opacity-30 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3">
        <div className="w-96 h-96 bg-orange-200 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center relative z-10">
        {/* Logo */}
        <div className="flex gap-2 sm:gap-3 items-center">
          <ClipboardCheck
            className="w-6 h-6 sm:w-8 sm:h-8"
            strokeWidth={2}
            color="#DC2626"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">dosphere</h1>
        </div>

        {/* Button */}
        <Link to={'./auth/login'}
          className="bg-[#DC2626] hover:bg-[#cd0c0c] 
            py-1.5 px-4 sm:py-2 sm:px-6 
            text-sm sm:text-base 
            font-semibold rounded-lg text-white"
        >
          Get Started
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center text-center relative z-10 mt-16">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
          Finally, organize your <br />
          work and{" "}
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            life
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl">
          Become focused, organized, and calm with <span className="text-[#DC2626]">dosphere</span>. <br />
          The smart way to manage tasks and to-dos.
        </p>

          <Link to={'./auth/login'}
          className="bg-[#DC2626] hover:bg-[#cd0c0c] 
            lg:px-8 lg:py-3 py-2 px-6 sm:py-2 sm:px-6 
            text-sm font-semibold rounded-lg text-white mt-5"
        >
          Start For Free
        </Link>

        <div className="relative p-4 h-[80vh] mt-8 mx-auto max-w-4xl w-full shadow-2xl rounded-lg">
          <div className="bg-gray-200 flex text-center justify-center h-full items-center text-5xl rounded-lg">
          <img className="h-full" src={demoImage} alt="" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
