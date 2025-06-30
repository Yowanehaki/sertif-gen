import React, { useState } from 'react';
import { CheckCircle, Calendar, User } from 'lucide-react';
import logo from "../assets/logo.png";

function FormUser({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    activity: '',
    confirmAttendance: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const activities = [
    'Seminar Digital Marketing',
    'Try Out UTBK 2025',
    'Seminar Kewirausahaan',
    'Try Out CPNS 2025',
    'Webinar Teknologi AI',
    'Workshop Design Thinking'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Nama lengkap wajib diisi';
    }
    if (!formData.activity) {
      return 'Kegiatan wajib dipilih';
    }
    if (!formData.confirmAttendance) {
      return 'Mohon ceklis konfirmasi kehadiran Anda';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validasi
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      setIsSubmitting(false);
      return;
    }

    try {
      // Kirim data ke parent component
      const result = await (onSubmit ? onSubmit(formData) : { success: true });
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Kehadiran berhasil dikonfirmasi! Terima kasih atas partisipasi Anda.' });
        // Reset form
        setFormData({
          fullName: '',
          activity: '',
          confirmAttendance: false
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Terjadi kesalahan saat menyimpan data' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem. Silakan coba lagi.' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-5 py-6 md:p-6 lg:p-10 ">
    <div className="relative max-w-2xl mx-auto">
      {/* Main Form Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section - Mobile Side by Side Layout */}
        <div className="bg-blue-100 text-white px-4 py-7 md:px-8 md:py-4">
          <div className="flex items-center gap-4 md:gap-6">
            <img src={logo} alt="Logo" className="w-16 h-12 md:w-40 md:h-28 object-contain flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-black">
                Form Kehadiran
              </h1>
              <p className="text-sm md:text-lg font-bold text-gray-700">Workshop & Activity</p>
            </div>
          </div>
        </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nama Lengkap */}
              <div className="group">
                <label htmlFor="fullName" className="flex items-center text-sm md:text-base font-bold text-gray-700 mb-3">
                  <User className="w-5 h-5 mr-2 text-gray-700" />
                  Nama Lengkap <span className="text-red-500 ml-1">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-4 md:py-4 text-sm md:text-base border border-gray-500 rounded-lg transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Activity */}
              <div className="group">
                <label htmlFor="activity" className="flex items-center text-sm md:text-base font-bold text-gray-700 mb-3">
                  <Calendar className="w-5 h-5 mr-2 text-gray-700" />
                  Kegiatan <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    id="activity"
                    name="activity"
                    value={formData.activity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 md:py-4 text-sm md:text-base border border-gray-500 rounded-lg transition-colors duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled hidden className="text-gray-400">Pilih kegiatan yang akan diikuti</option>
                    {activities.map((activity) => (
                      <option key={activity} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div>
                <div className="flex items-start space-x-3 p-4 md:p-6 bg-blue-50 rounded-lg border border-blue-300">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      id="confirmAttendance"
                      name="confirmAttendance"
                      checked={formData.confirmAttendance}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 hover:border-blue-400 cursor-pointer transition-all duration-200"
                    />
                  </div>
                  <label htmlFor="confirmAttendance" className="cursor-pointer">
                    <div className="flex items-center mb-1">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Konfirmasi Kehadiran</span>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                      Saya mengkonfirmasi menghadiri dan mengikuti kegiatan hingga selesai
                    </p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-br from-green-700 to-blue-700 hover:from-green-500 hover:to-blue-900 text-white py-2 md:py-3 px-8 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
            {/* Message */}
            {message.text && (
              <div className={`mt-6 p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center text-red-600 font-bold">
                        !
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm md:text-base">{message.text}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>©2025 PT. Graha Karya Informasi. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default FormUser;