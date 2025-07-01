import React, { useState } from 'react';
import { Home, Upload, Settings, Edit, Trash2, Plus, Download, Users, FileText, Calendar, Search, Filter, X, ChevronDown } from 'lucide-react';
import NavigationMenu from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';
import EditForm from './Components/EditForm.jsx';
import UploadExcel from './Components/UploadExcel.jsx';
import TabelPeserta from './Components/TabelPeserta.jsx';
import FilterComponent from './Components/Filter.jsx';
import HapusPeserta from './Components/HapusPeserta.jsx';

const dummyPeserta = [
  { id: 1, nama: 'Budi Santoso', email: 'budi@email.com', aktivitas: 'Seminar AI', tgl: '2024-06-01', status: 'Hadir' },
  { id: 2, nama: 'Siti Nurhaliza', email: 'siti@email.com', aktivitas: 'Workshop Design', tgl: '2024-06-02', status: 'Hadir' },
  { id: 3, nama: 'Andi Prasetyo', email: 'andi@email.com', aktivitas: 'Try Out UTBK', tgl: '2024-06-03', status: 'Tidak Hadir' },
  { id: 4, nama: 'Maya Sari', email: 'maya@email.com', aktivitas: 'Seminar AI', tgl: '2024-06-01', status: 'Hadir' },
  { id: 5, nama: 'Rizki Ahmad', email: 'rizki@email.com', aktivitas: 'Workshop Design', tgl: '2024-06-02', status: 'Hadir' },
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
        <main className="flex-1 p-6">
          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Peserta</h2>
                <p className="text-gray-600">Kelola data peserta dan generate sertifikat dengan mudah</p>
              </div>

              {/* Filters */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <Filter filter={filter} setFilter={setFilter} aktivitas={aktivitas} />
              </div>

              {/* Table */}
              <TabelPeserta
                filteredPeserta={filteredPeserta}
                selected={selected}
                handleSelect={handleSelect}
                handleSelectAll={handleSelectAll}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />

              {/* Action Buttons */}
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