import React from 'react';
import logo from '../assets/logo.png';

//Tampilan halaman apresiasi setelah mengirimkan feedback
const Appreciate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card container */}
        <div className="bg-white rounded-2xl shadow-lg border-0 p-8 text-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-10 -translate-x-10 opacity-50"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Success icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            {/* Logo */}
            <div className="w-50 h-30 mx-auto mb-1">
              <img src={logo} alt="logo" className="w-full h-full object-contain opacity-80" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Terima Kasih!</h1>

            {/* Message */}
            <p className="text-gray-600 text-base leading-relaxed mb-3">Kami menghargai kehadiran Anda.</p>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm font-medium">Dukungan Anda sangat berarti bagi kami.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appreciate;