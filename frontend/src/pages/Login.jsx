import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../assets/bglogin.png'; 

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!formData.username.trim()) {
      setError('Username wajib diisi');
      setIsSubmitting(false);
      return;
    }
    if (!formData.password.trim()) {
      setError('Password wajib diisi');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real API call
      if (formData.username === 'admin' && formData.password === 'admin') {
        if (onLogin) {
          onLogin({ username: formData.username });
        }
        setError('');
      } else if (formData.username !== 'admin') {
        setError('Username tidak ditemukan!');
      } else {
        setError('Password salah!');
      }
    } catch {
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div 
      className="min-h-screen flex justify-center items-center p-2.5 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: `url(${Image})`
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/30 relative">
        {/* Tombol Kembali ke Form User di pojok kiri atas */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
        >
          &larr; Kembali
        </button>
        <h3 className="text-2xl font-semibold text-white text-center mb-6 font-['Roboto']">
          Login Atmin 123😹
        </h3>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/80 text-white p-3 rounded-lg text-center mb-4 font-bold text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-white font-medium mb-2 font-['Poppins']"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg border-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 font-['Poppins']"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-white font-medium mb-2 font-['Poppins']"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 font-['Poppins']"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-green-600 text-white py-3 px-4 rounded-lg font-bold text-base border-none cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </div>

        {/* Demo credentials info */}
        <div className="mt-6 text-center text-white/80 text-sm">
          <p className="mb-1">Demo credentials:</p>
          <p>Username: <span className="font-semibold">admin</span></p>
          <p>Password: <span className="font-semibold">admin</span></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;