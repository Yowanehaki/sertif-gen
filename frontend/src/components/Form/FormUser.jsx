import React from 'react';
import { CheckCircle, Calendar, User } from 'lucide-react';

function FormUser({
  formData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  message,
  activities,
  batchList = []
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8" style={{ fontFamily: "'Nunito', sans-serif" }}>
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
            {activities.map((a) => (
              <option key={a.id} value={a.nama}>
                {a.nama}
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

      {/* Batch */}
      <div className="group">
         <label htmlFor="activity" className="flex items-center text-sm md:text-base font-bold text-gray-700 mb-3">
          <Calendar className="w-5 h-5 mr-2 text-gray-700" />
          Batch <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <select
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleInputChange}
            className="w-full px-4 py-4 md:py-4 text-sm md:text-base border border-gray-500 rounded-lg transition-colors duration-200 appearance-none cursor-pointer"
          >
            <option value="" disabled hidden className="text-gray-400">Pilih batch</option>
            {batchList.map((b) => (
              <option key={b.id} value={b.nama} className="font-semibold text-blue-700">{b.nama}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="group">
        <label htmlFor="email" className="flex items-center text-sm md:text-base font-bold text-gray-700 mb-3">
          <span className="w-5 h-5 mr-2 text-gray-700">@</span>
          Email <span className="text-red-500 ml-1">*</span>
        </label>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="user@gmail.com"
            className="w-full px-4 py-4 md:py-4 text-sm md:text-base border border-gray-500 rounded-lg transition-colors duration-200"
          />
        </div>
      </div>

      {/* No Telp */}
      <div className="group">
        <label htmlFor="no_telp" className="flex items-center text-sm md:text-base font-bold text-gray-700 mb-3">
          <span className="w-5 h-5 mr-2 text-gray-700">📞</span>
          No Telp <span className="text-red-500 ml-1">*</span>
        </label>
        <div>
          <input
            type="text"
            id="no_telp"
            name="no_telp"
            value={formData.no_telp}
            onChange={handleInputChange}
            placeholder="081234567890"
            className="w-full px-4 py-4 md:py-4 text-sm md:text-base border border-gray-500 rounded-lg transition-colors duration-200"
          />
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div>
        <div className="flex items-start space-x-3 p-4 md:p-6 bg-blue-50 rounded-lg border border-blue-300">
          <div className="flex-shrink-0 mt-1">
            <input
              type="checkbox"
              id="verifikasi"
              name="verifikasi"
              checked={formData.verifikasi}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 hover:border-blue-400 cursor-pointer transition-all duration-200"
            />
          </div>
          <label htmlFor="verifikasi" className="cursor-pointer">
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
    </form>
  );
}

export default FormUser;