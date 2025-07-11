import React, { useState, useEffect } from 'react';
import { Home, Upload, Settings, Menu, X, Trash2 } from 'lucide-react';
import NavigationMenu from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';
import EditForm from './Components/EditForm.jsx';
import KelolaBatch from './Components/KelolaBatch.jsx';
import TambahAktivitasBaruModal from './Components/TambahAktivitasBaruModal.jsx';
import { getPeserta } from '../../services/dashboard/peserta.service';
import { getAktivitas, getAktivitasAktif, updateAktivitas, deleteAktivitas } from '../../services/dashboard/aktivitas.service.js';
import { getBatchList, getBatchAktif, deleteBatch } from '../../services/dashboard/batch.service';
import SignatureSelector from './Components/SignatureSelector';
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
  const [showDeleteBatch, setShowDeleteBatch] = useState(false);
  const [currentDeleteBatchId, setCurrentDeleteBatchId] = useState(null);
  const [showTambahAktivitas, setShowTambahAktivitas] = useState(false);
  const [notif, setNotif] = useState('');
  
  // State untuk modal EditForm
  const [showEditAktivitas, setShowEditAktivitas] = useState(false);
  const [showDeleteAktivitas, setShowDeleteAktivitas] = useState(false);
  const [currentEditIdx, setCurrentEditIdx] = useState(null);
  const [currentDeleteIdx, setCurrentDeleteIdx] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editKode, setEditKode] = useState('');

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

  // Handler functions untuk modal
  const handleOpenDeleteBatch = (id) => {
    setCurrentDeleteBatchId(id);
    setShowDeleteBatch(true);
  };

  const handleDeleteBatch = async () => {
    try {
      await deleteBatch(currentDeleteBatchId);
      await refreshBatchList();
      setShowDeleteBatch(false);
      setCurrentDeleteBatchId(null);
      setNotif('Batch berhasil dihapus');
      setTimeout(() => setNotif(''), 3000);
    } catch (error) {
      alert('Gagal menghapus batch: ' + error.message);
    }
  };

  const handleTambahAktivitas = async () => {
    try {
      // Handle tambah aktivitas baru
      setShowTambahAktivitas(false);
      setNotif('Aktivitas berhasil ditambahkan');
      setTimeout(() => setNotif(''), 3000);
    } catch (error) {
      alert('Gagal menambahkan aktivitas: ' + error.message);
    }
  };

  const handleCancelTambahAktivitas = () => {
    setShowTambahAktivitas(false);
  };

  // Handler functions untuk modal EditForm
  const handleOpenEditAktivitas = (idx) => {
    setCurrentEditIdx(idx);
    setEditValue(aktivitas[idx].nama);
    setEditKode(aktivitas[idx].kode || '');
    setShowEditAktivitas(true);
  };

  const handleOpenDeleteAktivitas = (idx) => {
    setCurrentDeleteIdx(idx);
    setShowDeleteAktivitas(true);
  };

  const handleEditAktivitasSave = async (e) => {
    e.preventDefault();
    if (editValue) {
      const id = aktivitas[currentEditIdx].id;
      try {
        await updateAktivitas({ id, nama: editValue, kode: editKode });
        await refreshAktivitas();
        await refreshAktivitasAktif();
        setShowEditAktivitas(false);
        setNotif('Aktivitas berhasil diupdate');
        setTimeout(() => setNotif(''), 2000);
      } catch {
        setNotif('Gagal update aktivitas (mungkin nama/kode sudah ada)');
        setTimeout(() => setNotif(''), 2000);
      }
    }
  };

  const handleDeleteAktivitasConfirm = async () => {
    const id = aktivitas[currentDeleteIdx].id;
    try {
      await deleteAktivitas(id);
      await refreshAktivitas();
      await refreshAktivitasAktif();
      setShowDeleteAktivitas(false);
      setNotif('Aktivitas berhasil dihapus');
      setTimeout(() => setNotif(''), 2000);
    } catch {
      setNotif('Gagal menghapus aktivitas');
      setTimeout(() => setNotif(''), 2000);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'upload', label: 'Upload Excel', icon: Upload, path: '/Uploadpeserta' },
    { id: 'aktivitas', label: 'Edit Form', icon: Settings, path: '/EditFormPage' },
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
                    setNotif={setNotif}
                    aktivitasBaru={aktivitasBaru}
                    refreshAktivitasAktif={refreshAktivitasAktif}
                    onOpenEdit={handleOpenEditAktivitas}
                    onOpenDelete={handleOpenDeleteAktivitas}
                  />
                </div>
                <div className="flex-[0.9] h-full flex flex-col">
                  <KelolaBatch
                    setNotif={setNotif}
                    batchList={batchList}
                    onOpenDeleteBatch={handleOpenDeleteBatch}
                    refreshBatchList={refreshBatchList}
                    refreshBatchAktif={refreshBatchAktif}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Tambah Aktivitas Baru */}
      <TambahAktivitasBaruModal
        show={showTambahAktivitas}
        aktivitasBaru={aktivitasBaru}
        onClose={handleCancelTambahAktivitas}
        onSubmit={handleTambahAktivitas}
      />

      {/* Notifikasi */}
      {notif && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-xl shadow-lg z-50 text-center text-sm font-medium animate-fade-in">
          {notif}
        </div>
      )}

      {/* Modal Hapus Batch */}
      {showDeleteBatch && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Hapus Batch</h3>
                <button onClick={() => setShowDeleteBatch(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600">
                  Yakin ingin menghapus batch <span className="font-semibold text-gray-800">{batchList.find(b => b.id === currentDeleteBatchId)?.nama}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={handleDeleteBatch} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">Hapus</button>
                <button onClick={() => setShowDeleteBatch(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200">Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Aktivitas */}
      {showEditAktivitas && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Aktivitas</h3>
                <button onClick={() => setShowEditAktivitas(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleEditAktivitasSave} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Nama Aktivitas</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" value={editValue} onChange={e => setEditValue(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Kode Aktivitas</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" value={editKode} onChange={e => setEditKode(e.target.value)} required />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">Simpan</button>
                  <button type="button" onClick={() => setShowEditAktivitas(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200">Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Aktivitas */}
      {showDeleteAktivitas && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Hapus Aktivitas</h3>
                <button onClick={() => setShowDeleteAktivitas(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600">
                  Yakin ingin menghapus aktivitas <span className="font-semibold text-gray-800">{aktivitas[currentDeleteIdx]?.nama}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={handleDeleteAktivitasConfirm} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">Hapus</button>
                <button onClick={() => setShowDeleteAktivitas(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200">Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditFormPage; 