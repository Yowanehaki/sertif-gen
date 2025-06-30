import React, { useState } from 'react';
import { Home, Upload, Settings, Edit, Trash2, Plus, Download, Users, FileText, Calendar, Search, Filter, X, ChevronDown } from 'lucide-react';
import NavigationMenu from '../components/navbar.jsx';

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
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
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
  
  const handleEdit = (row) => {
    setEditData(row);
    setShowEdit(true);
  };
  
  const handleDelete = (row) => {
    setEditData(row);
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
      <NavigationMenu totalPeserta={peserta.length} />

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
        <aside className="w-72 min-h-screen bg-white/70 backdrop-blur-sm border-r border-white/20 p-6 hidden md:block">
          <div className="space-y-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    tab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-3">Statistik Cepat</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Peserta</span>
                <span className="font-semibold text-blue-600">{peserta.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hadir</span>
                <span className="font-semibold text-green-600">
                  {peserta.filter(p => p.status === 'Hadir').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Aktivitas</span>
                <span className="font-semibold text-purple-600">{aktivitas.length}</span>
              </div>
            </div>
          </div>
        </aside>

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
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cari nama peserta..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={filter.nama}
                      onChange={e => setFilter(f => ({...f, nama: e.target.value}))}
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white min-w-48"
                      value={filter.aktivitas}
                      onChange={e => setFilter(f => ({...f, aktivitas: e.target.value}))}
                    >
                      <option value="">Semua Aktivitas</option>
                      {aktivitas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={filter.tgl}
                      onChange={e => setFilter(f => ({...f, tgl: e.target.value}))}
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="p-4 text-left">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            checked={selected.length === filteredPeserta.length && filteredPeserta.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">ID</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Nama</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Aktivitas</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Tanggal</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPeserta.map((row, index) => (
                        <tr key={row.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}>
                          <td className="p-4">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              checked={selected.includes(row.id)}
                              onChange={() => handleSelect(row.id)}
                            />
                          </td>
                          <td className="p-4 font-medium text-gray-900">#{row.id}</td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{row.nama}</div>
                          </td>
                          <td className="p-4 text-gray-600">{row.email}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {row.aktivitas}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{row.tgl}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              row.status === 'Hadir' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(row)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(row)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
          {tab === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Data Peserta</h2>
                  <p className="text-gray-600">Upload file Excel untuk menambah peserta secara bulk</p>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag & drop file Excel atau klik untuk browse</p>
                    <input type="file" accept=".xlsx,.xls" className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-block transition-colors duration-200">
                      Pilih File
                    </label>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-blue-800 font-medium mb-1">Template Excel</p>
                        <p className="text-blue-600 text-sm mb-2">Download template untuk format yang benar</p>
                        <a href="/template.xlsx" download className="text-blue-600 hover:text-blue-700 font-medium underline">
                          Download Template
                        </a>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Upload Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Aktivitas Tab */}
          {tab === 'aktivitas' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Kelola Aktivitas</h2>
                  <p className="text-gray-600">Tambah, edit, atau hapus jenis aktivitas</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    {aktivitas.map((a, idx) => (
                      <div key={a} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                        <span className="font-medium text-gray-800">{a}</span>
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setAktivitas(aktivitas.filter((_, i) => i !== idx))}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    className="flex gap-3"
                    onSubmit={e => {
                      e.preventDefault();
                      if(editAktivitas && !aktivitas.includes(editAktivitas)) {
                        setAktivitas([...aktivitas, editAktivitas]);
                      }
                      setEditAktivitas('');
                    }}
                  >
                    <div className="relative flex-1">
                      <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nama aktivitas baru..."
                        value={editAktivitas}
                        onChange={e => setEditAktivitas(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Tambah
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Edit Peserta */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Peserta</h3>
                <button
                  onClick={() => setShowEdit(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={e => {
                e.preventDefault();
                setPeserta(peserta.map(p => p.id === editData.id ? {...p, nama: editData.nama, aktivitas: editData.aktivitas} : p));
                setShowEdit(false);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={editData?.nama || ''}
                      onChange={e => setEditData({...editData, nama: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aktivitas</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={editData?.aktivitas || ''}
                      onChange={e => setEditData({...editData, aktivitas: e.target.value})}
                    >
                      {aktivitas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Peserta */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Hapus Peserta</h3>
                <button
                  onClick={() => setShowDelete(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600">
                  Yakin ingin menghapus peserta <span className="font-semibold text-gray-800">{editData?.nama}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setPeserta(peserta.filter(p => p.id !== editData.id));
                    setShowDelete(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Hapus
                </button>
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;