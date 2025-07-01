import React, { useState } from 'react';
import { Home, Upload, Settings, Edit, Trash2, Plus, Download, Users, FileText, Calendar, Search, X, ChevronDown } from 'lucide-react';
import NavigationMenu from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';
import EditForm from './Components/EditForm.jsx';
import UploadExcel from './Components/UploadExcel.jsx';
import TabelPeserta from './Components/TabelPeserta.jsx';
import Filter from './Components/Filter.jsx';
import HapusPeserta from './Components/HapusPeserta.jsx';

const dummyPeserta = [
  { id: 1, nama: 'Budi Santoso', aktivitas: 'Seminar AI', tgl: '2024-06-01', status: 'Hadir' },
  { id: 2, nama: 'Siti Nurhaliza', aktivitas: 'Workshop Design', tgl: '2024-06-02', status: 'Hadir' },
  { id: 3, nama: 'Andi Prasetyo', aktivitas: 'Try Out UTBK', tgl: '2024-06-03', status: 'Tidak Hadir' },
  { id: 4, nama: 'Maya Sari', aktivitas: 'Seminar AI', tgl: '2024-06-01', status: 'Hadir' },
  { id: 5, nama: 'Rizki Ahmad', aktivitas: 'Workshop Design', tgl: '2024-06-02', status: 'Hadir' },
  { id: 6, nama: 'Dewi Lestari', aktivitas: 'Seminar AI', tgl: '2024-06-04', status: 'Hadir' },
  { id: 7, nama: 'Fajar Nugroho', aktivitas: 'Try Out UTBK', tgl: '2024-06-05', status: 'Tidak Hadir' },
  { id: 8, nama: 'Galih Saputra', aktivitas: 'Workshop Design', tgl: '2024-06-06', status: 'Hadir' },
  { id: 9, nama: 'Hana Putri', aktivitas: 'Seminar AI', tgl: '2024-06-07', status: 'Hadir' },
  { id: 10, nama: 'Indra Wijaya', aktivitas: 'Try Out UTBK', tgl: '2024-06-08', status: 'Tidak Hadir' },
  { id: 11, nama: 'Joko Susilo', aktivitas: 'Workshop Design', tgl: '2024-06-09', status: 'Hadir' },
  { id: 12, nama: 'Kiki Amelia', aktivitas: 'Seminar AI', tgl: '2024-06-10', status: 'Hadir' },
  { id: 13, nama: 'Lina Marlina', aktivitas: 'Try Out UTBK', tgl: '2024-06-11', status: 'Tidak Hadir' },
  { id: 14, nama: 'Maman Suherman', aktivitas: 'Workshop Design', tgl: '2024-06-12', status: 'Hadir' },
  { id: 15, nama: 'Nina Agustina', aktivitas: 'Seminar AI', tgl: '2024-06-13', status: 'Hadir' },
  { id: 16, nama: 'Oki Setiawan', aktivitas: 'Try Out UTBK', tgl: '2024-06-14', status: 'Tidak Hadir' },
  { id: 17, nama: 'Putri Ayu', aktivitas: 'Workshop Design', tgl: '2024-06-15', status: 'Hadir' },
  { id: 18, nama: 'Qori Rahman', aktivitas: 'Seminar AI', tgl: '2024-06-16', status: 'Hadir' },
  { id: 19, nama: 'Rina Sari', aktivitas: 'Try Out UTBK', tgl: '2024-06-17', status: 'Tidak Hadir' },
  { id: 20, nama: 'Sandy Pratama', aktivitas: 'Workshop Design', tgl: '2024-06-18', status: 'Hadir' },
];

const dummyAktivitas = [
  'Seminar AI',
  'Workshop Design',
  'Try Out UTBK',
];

function Dashboard() {
  const [tab, setTab] = useState('dashboard');
  const [peserta, setPeserta] = useState(dummyPeserta);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState({ nama: '', aktivitas: '', tgl: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [aktivitas, setAktivitas] = useState(dummyAktivitas);
  const [editAktivitas, setEditAktivitas] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Filter peserta
  const filteredPeserta = peserta.filter(p =>
    p.nama.toLowerCase().includes(filter.nama.toLowerCase()) &&
    (filter.aktivitas ? p.aktivitas === filter.aktivitas : true) &&
    (filter.tgl ? p.tgl === filter.tgl : true)
  );

  // Handler functions
  const handleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };
  
  const handleSelectAll = () => {
    setSelected(selected.length === filteredPeserta.length ? [] : filteredPeserta.map(p => p.id));
  };
  
  const handleEdit = () => {
    setShowDelete(true);
  };
  
  const handleDelete = () => {
    setShowDelete(true);
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
                    <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <FileText className="w-4 h-4" />
                      <span>Generate Sertifikat</span>
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus Terpilih ({selected.length})</span>
                    </button>
                  </div>
                </div>
                <Filter
                  filter={filter}
                  setFilter={setFilter}
                  aktivitas={aktivitas}
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
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {tab === 'upload' && <UploadExcel />}

          {/* Edit Aktivitas Tab */}
          {tab === 'aktivitas' && (
            <EditForm
              aktivitas={aktivitas}
              setAktivitas={setAktivitas}
              editAktivitas={editAktivitas}
              setEditAktivitas={setEditAktivitas}
            />
          )}
        </main>
      </div>

      {/* Modal Hapus Peserta */}
      <HapusPeserta
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={() => {
          setPeserta(peserta.filter(p => !selected.includes(p.id)));
          setShowDelete(false);
        }}
        selected={selected}
        peserta={peserta}
      />
    </div>
  );
}

export default Dashboard;