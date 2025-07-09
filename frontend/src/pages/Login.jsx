import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/bglogin.png";
import iconBack from "../assets/back_icon.png";
import leftImage from "../assets/logo.png";


import LoginForm from "../components/Form/FormLogin";

const Login = () => {
  useEffect(() => { document.title = 'Login Admin'; }, []);
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <style>
        {`
          /* Menghilangkan icon reveal di Chrome/Edge/Chromium */
          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear,
          input[type="password"]::-webkit-reveal,
          input[type="password"]::-webkit-clear {
            display: none;
          }
        `}
      </style>

      {/* Button Back */}
      <Link to="/">
        <div className="absolute top-15 left-15 w-9 h-9  bg-opacity-1 cursor-pointer">
          <img
            src={iconBack}
            alt="Back"
            className="w-full h-full"
          />
        </div>
      </Link>

      <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden max-w-[978px] w-full backdrop-blur-lg">
        {/* Left section */}
        <div
          className="hidden md:flex w-full md:w-[54%] h-[575px] relative items-start justify-center"
          style={{
            backgroundImage: `url(${leftImage})`,
            backgroundPosition: "center 140px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "60%",
          }}
        >
          {/* Left image is now background, no <img> needed */}
          <div className="flex flex-col items-center justify-center w-full h-full text-center p-8 relative z-10">
            <p className="text-lg text-gray-700 mt-4">
              Login as admin to access the system
            </p>
          </div>
        </div>

        {/* Right section*/}
        <div className="w-full md:w-[46%] h-[575px] flex flex-col justify-center p-8 bg-white/50 backdrop-blur-lg">
          <h2 className="text-2xl font-semibold text-center text-white-800 mb-10 mt-12">
            Welcome Back !
          </h2>

          <LoginForm></LoginForm>

          {/* Footer Text */}
          <div className="text-center mt-8 text-sm text-gray-700">
            <p>
              Generate Sertifikat dengan gampang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;