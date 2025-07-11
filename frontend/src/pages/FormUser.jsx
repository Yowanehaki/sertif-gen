import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, User } from 'lucide-react';
import logo from "../assets/logo.png";
import FormUserForm from '../components/Form/FormUser.jsx';
import { useNavigate } from 'react-router-dom';
import { getAktivitas } from '../services/dashboard/aktivitas.service';
import { getBatchList } from '../services/dashboard/batch.service';
import { getFormUserStatus } from '../services/dashboard/api';
import Nonactive from './Nonactive.jsx';

function FormUser() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    no_telp: '',
    activity: '',
    batch: '',
    verifikasi: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activities, setActivities] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [formUserAktif, setFormUserAktif] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAktivitas = async () => {
      try {
        const data = await getAktivitas();
        setActivities(data.filter(a => a.aktif));
      } catch {
        setActivities([]);
      }
    };
    const fetchBatch = async () => {
      try {
        const data = await getBatchList();
        setBatchList(data.filter(b => b.aktif));
      } catch {
        setBatchList([]);
      }
    };
    const fetchFormUserStatus = async () => {
      try {
        const aktif = await getFormUserStatus();
        setFormUserAktif(aktif);
      } catch {
        setFormUserAktif(true);
      }
    };
    fetchAktivitas();
    fetchBatch();
    fetchFormUserStatus();
  }, []);

  useEffect(() => { document.title = 'Form Kehadiran'; }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validasi khusus untuk nomor telepon
    if (name === 'no_telp') {
      // Hapus semua karakter non-angka
      const cleanValue = value.replace(/[^0-9]/g, '');
      
      // Batasi panjang maksimal 13 digit
      const limitedValue = cleanValue.slice(0, 13);
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Nama lengkap wajib diisi';
    }
    if (!formData.email.trim()) {
      return 'Email wajib diisi';
    }
    
    // Validasi nomor telepon
    if (!formData.no_telp.trim()) {
      return 'No telp wajib diisi';
    }
    
    // Validasi format nomor telepon
    const phoneRegex = /^08[0-9]{8,11}$/;
    if (!phoneRegex.test(formData.no_telp)) {
      return 'Format nomor telepon tidak valid. Gunakan format: 081234567890 (minimal 11 digit, maksimal 13 digit)';
    }
    
    if (!formData.activity) {
      return 'Kegiatan wajib dipilih';
    }
    if (!formData.batch) {
      return 'Batch wajib dipilih';
    }
    if (!formData.verifikasi) {
      return 'Mohon ceklis konfirmasi kehadiran Anda';
    }
    return null;
  };

  const handleShowModal = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('http://localhost:5000/dashboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.fullName,
          email: formData.email,
          no_telp: formData.no_telp,
          aktivitas: formData.activity,
          batch: formData.batch,
          verifikasi: !!formData.verifikasi,
          companyCode: 'DEFAULT',
        })
      });
      const result = await res.json();
      if (res.ok) {
        navigate('/apresiasi');
        return;
      } else {
        setMessage({ type: 'error', text: result.message || 'Terjadi kesalahan saat menyimpan data' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem. Silakan coba lagi.' });
    }
    setIsSubmitting(false);
    setShowConfirmModal(false);
  };

  if (formUserAktif === null) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat status form...</div>;
  }
  if (!formUserAktif) {
    return <Nonactive />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-5 py-6 md:p-6 lg:p-10 ">
    <div className="relative max-w-2xl mx-auto">
      {/* Main Form Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section - Mobile Side by Side Layout */}
        <div className="bg-blue-100 text-white px-4 py-7 md:px-8 md:py-4">
          <div className="flex items-center gap-4 md:gap-6">
            <img src={logo} alt="Logo" className="w-16 h-12 md:w-40 md:h-28 object-contain flex-shrink-0" />
            <div className="flex-1" style={{ fontFamily: "'PT Sans', sans-serif" }}>
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-black">
                Form Kehadiran
              </h1>
              <p className="text-sm md:text-lg font-bold text-gray-700">Workshop & Activity</p>
            </div>
          </div>
        </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 lg:p-10">
            <FormUserForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleShowModal}
              isSubmitting={isSubmitting}
              message={message}
              activities={activities}
              batchList={batchList}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>©2025 PT. Graha Karya Informasi. All rights reserved.</p>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Konfirmasi Kehadiran</h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">Apakah Anda yakin dengan data kehadiran Anda?</p>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm sm:text-base"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >Batal</button>
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-gradient-to-br from-blue-700 to-blue-800 hover:from-green-700 hover:to-blue-700 text-white font-bold text-sm sm:text-base"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >{isSubmitting ? 'Menyimpan...' : 'Yakin & Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormUser;