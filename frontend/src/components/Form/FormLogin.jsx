import React, { useState } from "react";
import { Link } from "react-router-dom";

import { AdminAuthentication } from "../../services/adminAuth/adminAuth.service";
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <form className="space-y-4" onSubmit={AdminAuthentication}>
      {/* Username Input */}
      <div>
        <label className="block text-sm font-normal text-white-800 mb-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full px-4 py-2 border border-black rounded-md bg-white/75 focus:outline-none focus:ring-2 focus:ring-blue-600"
          autoComplete="off"
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <label className="block text-sm font-normal text-white-800 mb-1">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-black rounded-md bg-white/75 focus:outline-none focus:ring-2 focus:ring-blue-600"
          autoComplete="off"
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 leading-none"
          style={{ paddingTop: "22px" }}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Buttons Submit */}
      <div className="flex gap-6">
        <button
          className="w-full text-center py-2 rounded-md font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-200 shadow-md"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;