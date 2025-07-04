import React, { useState, useEffect, useRef } from 'react';
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
import TambahAktivitasBaruModal from './Components/TambahAktivitasBaruModal.jsx';
import { getPeserta, updatePeserta, bulkDeletePeserta, uploadTandaTanganPeserta } from '../../services/dashboard/peserta.service';
import { getAktivitas, updateKodePerusahaan } from '../../services/dashboard/aktivitas.service.js';
import { getBatchList, deleteBatch } from '../../services/dashboard/batch.service';

function Dashboard() {
  const [tab, setTab] = useState('dashboard');
  const [peserta, setPeserta] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState({ nama: '', aktivitas: '', tgl: '', no_urut: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [selectedSingleDelete, setSelectedSingleDelete] = useState(null);
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
  const [showDeleteBatch, setShowDeleteBatch] = useState(false);
  const [currentDeleteBatchId, setCurrentDeleteBatchId] = useState(null);
  const [aktivitasBaru, setAktivitasBaru] = useState([]);
  const [showTambahAktivitas, setShowTambahAktivitas] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState(null);
  const downloadRef = useRef(null);

  // Ambil data peserta & aktivitas dari backend saat mount
  useEffect(() => {
    refreshPeserta();
    refreshAktivitas();
    refreshBatchList();
  }, []);

  // Tampilkan modal tambah aktivitas baru setiap kali aktivitasBaru berubah
  useEffect(() => {
    if (aktivitasBaru.length > 0) setShowTambahAktivitas(true);
  }, [aktivitasBaru]);

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

  // Helper untuk format tanggal dd/mm/yyyy
  function formatDateDMY(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Filter peserta
  const filteredPeserta = peserta.filter(p =>
    p.nama.toLowerCase().includes(filter.nama.toLowerCase()) &&
    (filter.aktivitas ? p.aktivitas === filter.aktivitas : true) &&
    (filter.batch ? (p.kodePerusahaan && p.kodePerusahaan.batch === filter.batch) : true) &&
    (filter.tgl
      ? formatDateDMY(p.tgl_submit || p.tgl) === formatDateDMY(filter.tgl)
      : true) &&
    (filter.no_urut && filter.no_urut !== ''
      ? (p.kodePerusahaan && String(p.kodePerusahaan.no_urut).includes(filter.no_urut))
      : true)
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

  // Untuk hapus satu peserta dari TabelPeserta
  const handleDeleteSingle = (id_sertif) => {
    setSelectedSingleDelete(id_sertif);
    setShowDelete(true);
  };

  // CRUD Operations
  const handleDeletePeserta = async () => {
    try {
      let idsToDelete = selected;
      if (selectedSingleDelete) {
        idsToDelete = [selectedSingleDelete];
      }
      await bulkDeletePeserta(idsToDelete);
      await refreshPeserta();
      setSelected([]);
      setSelectedSingleDelete(null);
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

  const handleOpenDeleteBatch = (id) => {
    setCurrentDeleteBatchId(id);
    setShowDeleteBatch(true);
  };

  const handleDeleteBatch = async () => {
    await deleteBatch(currentDeleteBatchId);
    await refreshBatchList();
    setShowDeleteBatch(false);
    setNotif('Batch berhasil dihapus');
    setTimeout(() => setNotif(''), 2000);
  };

  const handleTambahAktivitas = async (data) => {
    // data: [{ nama, kode }]
    try {
      await updateKodePerusahaan(data);
      setShowTambahAktivitas(false);
      setAktivitasBaru([]);
      await refreshAktivitas();
      await refreshPeserta(); // Refresh peserta untuk menampilkan kode yang sudah diupdate
      setNotif('Aktivitas berhasil ditambahkan dan kode perusahaan diupdate');
      setTimeout(() => setNotif(''), 2000);
    } catch (error) {
      console.error('Error adding activities:', error);
      setNotif('Gagal menambahkan aktivitas: ' + error.message);
      setTimeout(() => setNotif(''), 3000);
    }
  };

  // Fungsi generate single
  const handleGenerateSingle = async () => {
    setIsGenerating(true);
    try {
      let ttdPath = null;
      if (generateData.tandaTangan) {
        const uploadRes = await uploadTandaTanganPeserta(selected[0], generateData.tandaTangan);
        ttdPath = uploadRes.path;
      }
      await updatePeserta(selected[0], {
        nama_penguji: generateData.namaPenguji,
        jabatan_penguji: generateData.jabatanPenguji,
        tgl_terbit_sertif: generateData.tanggalTerbit,
        ...(ttdPath ? { tandatangan: ttdPath } : {})
      });
      // Generate PDF
      const pdfRes = await fetch(`http://localhost:5000/dashboard/${selected[0]}/generate`, { method: 'POST' });
      if (!pdfRes.ok) throw new Error('Gagal generate PDF');
      const pdfBlob = await pdfRes.blob();
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      // Generate PNG
      const pngRes = await fetch(`http://localhost:5000/dashboard/${selected[0]}/generate-png`, { method: 'POST' });
      if (!pngRes.ok) throw new Error('Gagal generate PNG');
      const pngBlob = await pngRes.blob();
      const pngUrl = window.URL.createObjectURL(pngBlob);
      setDownloadLinks({
        pdf: pdfUrl,
        png: pngUrl,
      });
      setNotif('Sertifikat berhasil digenerate!');
    } catch (err) {
      setNotif('Gagal generate sertifikat: ' + err.message);
    }
    setIsGenerating(false);
    setShowGenerate(false);
  };

  // Tambahkan fungsi handleGenerateBulkWithUpdate
  const handleGenerateBulkWithUpdate = async () => {
    setIsGenerating(true);
    try {
      // Upload tanda tangan jika ada
      let ttdPath = null;
      if (generateData.tandaTangan) {
        // Upload sekali, lalu gunakan path yang sama untuk semua peserta
        const uploadRes = await uploadTandaTanganPeserta(selected[0], generateData.tandaTangan);
        ttdPath = uploadRes.path;
      }
      // Update semua peserta terpilih
      await Promise.all(selected.map(id => updatePeserta(id, {
        nama_penguji: generateData.namaPenguji,
        jabatan_penguji: generateData.jabatanPenguji,
        tgl_terbit_sertif: generateData.tanggalTerbit,
        ...(ttdPath ? { tandatangan: ttdPath } : {})
      })));
      // Generate ZIP
      const res = await fetch('http://localhost:5000/dashboard/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected })
      });
      if (!res.ok) throw new Error('Gagal generate ZIP');
      const zipBlob = await res.blob();
      const zipUrl = window.URL.createObjectURL(zipBlob);
      setDownloadLinks({ zip: zipUrl });
      setNotif('ZIP sertifikat berhasil digenerate!');
      setTimeout(() => setNotif(''), 3000);
    } catch (err) {
      setNotif('Gagal generate ZIP: ' + err.message);
      setTimeout(() => setNotif(''), 3000);
    }
    setIsGenerating(false);
    setShowGenerate(false);
  };

  // Render tombol download di atas Filter
  const renderDownloadButtons = () => {
    if (!downloadLinks) return null;
    return (
      <div className="mb-4 flex gap-3">
        {downloadLinks.pdf && (
          <a
            href={downloadLinks.pdf}
            download={`sertifikat-${selected[0]}.pdf`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow"
            ref={downloadRef}
          >
            Download PDF
          </a>
        )}
        {downloadLinks.png && (
          <a
            href={downloadLinks.png}
            download={`sertifikat-${selected[0]}.png`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            Download PNG
          </a>
        )}
        {downloadLinks.zip && (
          <a
            href={downloadLinks.zip}
            download={`sertifikat-bulk.zip`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            Download ZIP (PDF & PNG)
          </a>
        )}
        <button
          className="ml-2 text-gray-500 hover:text-gray-700 text-xs"
          onClick={() => setDownloadLinks(null)}
        >
          Tutup
        </button>
      </div>
    );
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Excel', icon: Upload },
    { id: 'aktivitas', label: 'Edit Form', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <NavigationMenu 
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
          aktivitasBaru={aktivitasBaru}
          batchList={batchList}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-72">
          {/* Download Buttons */}
          {renderDownloadButtons()}
          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
                    <p className="text-gray-600">Kelola data peserta dan generate sertifikat</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowGenerate(true)}
                      className={
                        'px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ' +
                        (selected.length === 0
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white')
                      }
                      disabled={selected.length === 0 || isGenerating}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate Sertifikat</span>
                    </button>
                    <button
                      onClick={() => setShowDelete(true)}
                      className={
                        'px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ' +
                        (selected.length === 0
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white')
                      }
                      disabled={selected.length === 0}
                    >
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
                    handleDeleteSingle={handleDeleteSingle}
                    refreshPeserta={refreshPeserta}
                    setNotif={setNotif}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {tab === 'upload' && <UploadExcel onAktivitasBaru={setAktivitasBaru} />}

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
                  aktivitasBaru={aktivitasBaru}
                />
              </div>
              <div className="flex-[0.9] h-full flex flex-col">
                <KelolaBatch
                  setNotif={setNotif}
                  batchList={batchList}
                  onOpenDeleteBatch={handleOpenDeleteBatch}
                  refreshBatchList={refreshBatchList}
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
                if (selected.length === 1) {
                  await handleGenerateSingle();
                } else {
                  await handleGenerateBulkWithUpdate();
                }
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
                  <label className="block text-gray-700 font-medium mb-1">Tanda Tangan (upload)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full border rounded-lg px-3 py-2 bg-white"
                      onChange={e => setGenerateData({ ...generateData, tandaTangan: e.target.files[0] })}
                      disabled={isGenerating}
                    />
                    {generateData.tandaTangan && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 border border-red-200 rounded"
                        onClick={() => setGenerateData({ ...generateData, tandaTangan: null })}
                        disabled={isGenerating}
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  {generateData.tandaTangan && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-gray-600">File: {generateData.tandaTangan.name}</span>
                      <img
                        src={URL.createObjectURL(generateData.tandaTangan)}
                        alt="Preview Tanda Tangan"
                        className="h-12 border rounded shadow"
                        style={{ maxWidth: 120, objectFit: 'contain' }}
                      />
                    </div>
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
        onClose={() => {
          setShowDelete(false);
          setSelectedSingleDelete(null);
        }}
        onDelete={handleDeletePeserta}
        selected={selectedSingleDelete ? [selectedSingleDelete] : selected}
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

      {/* Modal Tambah Aktivitas Baru */}
      <TambahAktivitasBaruModal
        show={showTambahAktivitas}
        aktivitasBaru={aktivitasBaru}
        onClose={() => setShowTambahAktivitas(false)}
        onSubmit={handleTambahAktivitas}
      />
    </div>
  );
}

export default Dashboard;