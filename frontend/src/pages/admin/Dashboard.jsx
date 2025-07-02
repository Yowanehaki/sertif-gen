import React, { useState, useEffect } from 'react';
import { Home, Upload, Settings, Edit, Trash2, Plus, Download, Users, FileText, Calendar, Search, X, ChevronDown } from 'lucide-react';
import NavigationMenu from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';
import EditForm from './Components/EditForm.jsx';
import UploadExcel from './Components/UploadExcel.jsx';
import TabelPeserta from './Components/TabelPeserta.jsx';
import Filter from './Components/Filter.jsx';
import HapusPeserta from './Components/HapusPeserta.jsx';
import EditPeserta from './Components/EditPeserta.jsx';
import KelolaBatch from './Components/KelolaBatch.jsx';
import { getPeserta, updatePeserta, bulkDeletePeserta } from '../../services/dashboard/peserta.service';
import { getAktivitas } from '../../services/dashboard/aktivitas.service';
import { getBatchList } from '../../services/dashboard/batch.service';

function Dashboard() {
  const [tab, setTab] = useState('dashboard');
  const [peserta, setPeserta] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState({ nama: '', aktivitas: '', tgl: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [aktivitas, setAktivitas] = useState([]);
  const [editAktivitas, setEditAktivitas] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [generateData, setGenerateData] = useState({
    namaPenguji: '',
    jabatanPenguji: '',
    tanggalTerbit: '',
    tandaTangan: null
  });
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notif, setNotif] = useState('');
  const [batchList, setBatchList] = useState([]);

  // Ambil data peserta & aktivitas dari backend saat mount
  useEffect(() => {
    refreshPeserta();
    refreshAktivitas();
    refreshBatchList();
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
    setBatchList(data.filter(b => b.aktif));
  };

  // Filter peserta
  const filteredPeserta = peserta.filter(p =>
    p.nama.toLowerCase().includes(filter.nama.toLowerCase()) &&
    (filter.aktivitas ? p.aktivitas === filter.aktivitas : true) &&
    (filter.batch ? (p.kodePerusahaan && p.kodePerusahaan.batch === filter.batch) : true) &&
    (filter.tgl ? p.tgl === filter.tgl : true)
  );

  // Handler functions
  const handleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };
  
  const handleSelectAll = () => {
    setSelected(selected.length === filteredPeserta.length ? [] : filteredPeserta.map(p => p.id_sertif));
  };
  
  const handleEdit = (row) => {
    setEditData(row);
    setShowEdit(true);
  };
  
  const handleDelete = () => {
    setShowDelete(true);
  };

  // CRUD Operations
  const handleDeletePeserta = async () => {
    try {
      await bulkDeletePeserta(selected);
      await refreshPeserta();
      setSelected([]);
      setShowDelete(false);
      setNotif('Peserta berhasil dihapus');
      setTimeout(() => setNotif(''), 3000);
    } catch (error) {
      alert('Gagal menghapus peserta: ' + error.message);
    }
  };

  const handleUpdatePeserta = async (e) => {
    e.preventDefault();
    try {
      await updatePeserta(editData.id_sertif, {
        nama: editData.nama,
        aktivitas: editData.aktivitas,
        batch: editData.kodePerusahaan?.batch
      });
      await refreshPeserta();
      setShowEdit(false);
      setNotif('Peserta berhasil diedit');
      setTimeout(() => setNotif(''), 3000);
    } catch (error) {
      alert('Gagal update peserta: ' + error.message);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Excel', icon: Upload },
    { id: 'aktivitas', label: 'Kelola Aktivitas', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <NavigationMenu 
        totalPeserta={peserta.length}
        currentTab={tab}
        onTabChange={setTab}
      />

      {/* Notifikasi */}
      {notif && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-xl shadow-lg z-50 text-center text-sm font-medium animate-fade-in">
          {notif}
        </div>
      )}

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowMobileMenu(false)}></div>
          <div className="absolute right-4 top-20 bg-white rounded-2xl shadow-xl border p-4 min-w-48">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 mb-2 ${
                    tab === item.id
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
        </div>
      )}

      <div className="flex pt-20">
        {/* Sidebar */}
        <Sidebar
          tab={tab}
          setTab={setTab}
          peserta={peserta}
          aktivitas={aktivitas}
          sidebarItems={sidebarItems}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-72">
          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
                    <p className="text-gray-600">Kelola data peserta dan generate sertifikat dengan mudah</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setShowGenerate(true)} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <FileText className="w-4 h-4" />
                      <span>Generate Sertifikat</span>
                    </button>
                    <button onClick={() => setShowDelete(true)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus Terpilih ({selected.length})</span>
                    </button>
                  </div>
                </div>
                <Filter
                  filter={filter}
                  setFilter={setFilter}
                  aktivitas={aktivitas}
                  batches={batchList.map(b => b.nama)}
                  noCard
                />
                <div className="mt-6">
                  <TabelPeserta
                    filteredPeserta={filteredPeserta}
                    selected={selected}
                    handleSelect={handleSelect}
                    handleSelectAll={handleSelectAll}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    refreshPeserta={refreshPeserta}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {tab === 'upload' && <UploadExcel />}

          {/* Edit Aktivitas Tab */}
          {tab === 'aktivitas' && (
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-full">
              <div className="flex-[1.2] h-full flex flex-col">
                <EditForm
                  aktivitas={aktivitas}
                  setAktivitas={setAktivitas}
                  editAktivitas={editAktivitas}
                  setEditAktivitas={setEditAktivitas}
                  setTab={setTab}
                  setNotif={setNotif}
                />
              </div>
              <div className="flex-[0.9] h-full flex flex-col">
                <KelolaBatch 
                
                setNotif={setNotif} 
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Generate Sertifikat */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Generate Sertifikat</h3>
                <button
                  onClick={() => setShowGenerate(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  disabled={isGenerating}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                setIsGenerating(true);
                // ... logic generate ...
                setIsGenerating(false);
                setShowGenerate(false);
              }} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Nama Penguji</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" value={generateData.namaPenguji} onChange={e => setGenerateData({...generateData, namaPenguji: e.target.value})} required disabled={isGenerating} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Jabatan Penguji</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" value={generateData.jabatanPenguji} onChange={e => setGenerateData({...generateData, jabatanPenguji: e.target.value})} required disabled={isGenerating} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tanggal Terbit</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2" value={generateData.tanggalTerbit} onChange={e => setGenerateData({...generateData, tanggalTerbit: e.target.value})} required disabled={isGenerating} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Batch</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" value={generateData.batch || ''} onChange={e => setGenerateData({...generateData, batch: e.target.value})} required disabled={isGenerating} placeholder="Contoh: 1, 2, dst" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tanda Tangan (upload)</label>
                  <input type="file" accept="image/*" className="w-full" onChange={e => setGenerateData({...generateData, tandaTangan: e.target.files[0]})} disabled={isGenerating} />
                  {generateData.tandaTangan && (
                    <div className="mt-2 text-xs text-gray-600">File: {generateData.tandaTangan.name}</div>
                  )}
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105" disabled={isGenerating}>
                    {isGenerating ? 'Memproses...' : 'Generate'}
                  </button>
                  <button type="button" onClick={() => setShowGenerate(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200" disabled={isGenerating}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Peserta */}
      <HapusPeserta
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={handleDeletePeserta}
        selected={selected}
        peserta={peserta}
      />

      {/* Modal Edit Peserta */}
      <EditPeserta
        show={showEdit}
        onClose={() => setShowEdit(false)}
        editData={editData}
        setEditData={setEditData}
        onSave={handleUpdatePeserta}
        aktivitas={aktivitas}
        batchList={batchList}
      />
    </div>
  );
}

export default Dashboard;