import React, { useState, useEffect } from 'react';
import { Home, Upload, Settings, Menu } from 'lucide-react';
import NavigationMenu from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';
import EditForm from './Components/EditForm.jsx';
import KelolaBatch from './Components/KelolaBatch.jsx';
import { getPeserta } from '../../services/dashboard/peserta.service';
import { getAktivitas, getAktivitasAktif } from '../../services/dashboard/aktivitas.service.js';
import { getBatchList, getBatchAktif } from '../../services/dashboard/batch.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditFormPage() {
  const [peserta, setPeserta] = useState([]);
  const [aktivitas, setAktivitas] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [aktivitasAktif, setAktivitasAktif] = useState([]);
  const [batchAktif, setBatchAktif] = useState([]);
  const [aktivitasBaru] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [editAktivitas, setEditAktivitas] = useState('');

  // Ambil data dari backend saat mount
  useEffect(() => {
    refreshPeserta();
    refreshAktivitas();
    refreshBatchList();
    refreshAktivitasAktif();
    refreshBatchAktif();
  }, []);

  useEffect(() => {
    document.title = 'Edit Form';
  }, []);

  const refreshPeserta = async () => {
    const data = await getPeserta();
    setPeserta(data);
  };

  const refreshAktivitas = async () => {
    const data = await getAktivitas();
    setAktivitas(data);
  };

  const refreshBatchList = async () => {
    const data = await getBatchList();
    setBatchList(data);
  };

  const refreshAktivitasAktif = async () => {
    const data = await getAktivitasAktif();
    setAktivitasAktif(data);
  };

  const refreshBatchAktif = async () => {
    const data = await getBatchAktif();
    setBatchAktif(data);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'upload', label: 'Upload Excel', icon: Upload, path: '/Uploadpeserta' },
    { id: 'aktivitas', label: 'Edit Form', icon: Settings, path: '/Editform' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Navbar */}
      <NavigationMenu 
        currentTab="aktivitas"
        onTabChange={() => {}}
      />

      <div className="flex pt-20">
        {/* Sidebar */}
        {sidebarVisible && (
          <Sidebar
            tab="aktivitas"
            setTab={() => {}}
            peserta={peserta}
            aktivitas={aktivitas}
            sidebarItems={sidebarItems}
            aktivitasBaru={aktivitasBaru}
            batchList={batchList}
            aktivitasAktif={aktivitasAktif}
            batchAktif={batchAktif}
            visible={sidebarVisible}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarVisible ? 'md:ml-72' : 'ml-0 w-full'}`}>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <button
                  className="md:inline-flex hidden items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 mb-2 md:mb-0 md:mr-4"
                  onClick={() => setSidebarVisible(v => !v)}
                  title={sidebarVisible ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-full">
                <div className="flex-[1.2] h-full flex flex-col">
                  <EditForm
                    aktivitas={aktivitas}
                    setAktivitas={setAktivitas}
                    editAktivitas={editAktivitas}
                    setEditAktivitas={setEditAktivitas}
                    setTab={() => {}}
                    setNotif={() => {}}
                    aktivitasBaru={aktivitasBaru}
                    refreshAktivitasAktif={refreshAktivitasAktif}
                  />
                </div>
                <div className="flex-[0.9] h-full flex flex-col">
                  <KelolaBatch
                    setNotif={() => {}}
                    batchList={batchList}
                    onOpenDeleteBatch={() => {}}
                    refreshBatchList={refreshBatchList}
                    refreshBatchAktif={refreshBatchAktif}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditFormPage; 