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
    activity: '',
    batch: '',
    confirmAttendance: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activities, setActivities] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [formUserAktif, setFormUserAktif] = useState(null);

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
    if (!formData.batch) {
      return 'Batch wajib dipilih';
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
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/dashboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.fullName,
          aktivitas: formData.activity,
          batch: formData.batch,
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
            <FormUserForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
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
    </div>
  );
}

export default FormUser;