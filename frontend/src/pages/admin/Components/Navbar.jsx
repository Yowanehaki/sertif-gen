import React, { useState, useEffect } from 'react';
import { FileText, Users, Home, Upload, Settings, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png'
import { getFormUserStatus, setFormUserStatus } from '../../../services/dashboard/api';

export default function NavigationMenu({ currentTab, onTabChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const [formUserAktif, setFormUserAktif] = useState(true);
  const [loadingFormUser, setLoadingFormUser] = useState(false);
  const [notif, setNotif] = useState('');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Excel', icon: Upload },
    { id: 'aktivitas', label: 'Kelola Aktivitas', icon: Settings },
  ];

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingFormUser(true);
        const aktif = await getFormUserStatus();
        setFormUserAktif(aktif);
      } catch {
        setNotif('Gagal mengambil status FormUser');
        setTimeout(() => setNotif(''), 2000);
      } finally {
        setLoadingFormUser(false);
      }
    })();
  }, []);

  const handleToggleFormUser = async () => {
    try {
      setLoadingFormUser(true);
      const newStatus = !formUserAktif;
      await setFormUserStatus(newStatus);
      setFormUserAktif(newStatus);
      setNotif(`FormUser ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
      setTimeout(() => setNotif(''), 2000);
    } catch {
      setNotif('Gagal update status FormUser');
      setTimeout(() => setNotif(''), 2000);
    } finally {
      setLoadingFormUser(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20 mx-4 mt-4 rounded-2xl' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-25 h-8 rounded-lg flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-25 h-25 object-contain" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
              Genarate Sertificate
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 text-xs">FormUser</span>
              <button
                onClick={handleToggleFormUser}
                disabled={loadingFormUser}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formUserAktif ? 'bg-green-500' : 'bg-gray-300'}`}
                style={{ minWidth: 44 }}
              >
                <span className="sr-only">Aktifkan/Nonaktifkan FormUser</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formUserAktif ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
            <button onClick={() => setShowLogout(true)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setShowMobileMenu(false)}></div>
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-4 z-50">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
              </div>
            </div>
            {/* Navigation tabs for mobile */}
            <div className="space-y-2 mb-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange?.(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      currentTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowLogout(true)} className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200">
              Logout
            </button>
          </div>
        </>
      )}
      {/* Modal Logout */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Konfirmasi Logout</h3>
                <button onClick={() => setShowLogout(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600">
                  Yakin ingin logout dari aplikasi?
                </p>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => { setShowLogout(false); navigate('/login'); }} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">Logout</button>
                <button onClick={() => setShowLogout(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200">Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Notifikasi */}
      {notif && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-xl shadow-lg z-50 text-center text-sm font-medium animate-fade-in">
          {notif}
        </div>
      )}
    </nav>
  );
}