import React, { useState, useEffect, useRef } from 'react';
import { Home, Upload, Settings, Edit, Trash2, Plus, Download, Users, FileText, Calendar, Search, X, ChevronDown, CheckCircle, Menu } from 'lucide-react';
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
import SignatureSelector from './Components/SignatureSelector';
import { getAktivitas, getAktivitasAktif } from '../../services/dashboard/aktivitas.service.js';
import { getBatchList, getBatchAktif } from '../../services/dashboard/batch.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [tab, setTab] = useState('dashboard');
  const [peserta, setPeserta] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState({ nama: '', aktivitas: '', tgl: '', no_urut: '', verifikasi: '' });
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
    tandaTangan: null,
    selectedSignaturePath: null
  });
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notif, setNotif] = useState('');
  const [batchList, setBatchList] = useState([]);

  const [downloadLinks, setDownloadLinks] = useState(null);
  const downloadRef = useRef(null);
  const [aktivitasAktif, setAktivitasAktif] = useState([]);
  const [batchAktif, setBatchAktif] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showVerifModal, setShowVerifModal] = useState(false);
  const [verifId, setVerifId] = useState(null);
  const [selectedBulkVerif, setSelectedBulkVerif] = useState([]);
  const [verifData, setVerifData] = useState({
    namaPenguji: '',
    jabatanPenguji: '',
    tanggalTerbit: '',
    tandaTangan: null,
    selectedSignaturePath: null
  });

  // Ambil data peserta & aktivitas dari backend saat mount
  useEffect(() => {
    refreshPeserta();
    refreshAktivitas();
    refreshBatchList();
    refreshAktivitasAktif();
    refreshBatchAktif();
  }, []);

  useEffect(() => {
    document.title = 'Dashboard';
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
  let filteredPeserta = peserta.filter(p =>
    p.nama.toLowerCase().includes(filter.nama.toLowerCase()) &&
    (filter.aktivitas ? p.aktivitas === filter.aktivitas : true) &&
    (filter.batch ? (p.kodePerusahaan && p.kodePerusahaan.batch === filter.batch) : true) &&
    (filter.tgl
      ? formatDateDMY(p.tgl_submit || p.tgl) === formatDateDMY(filter.tgl)
      : true) &&
    (filter.verifikasi !== '' ? p.verifikasi === (filter.verifikasi === 'true') : true)
  );

  // Sort berdasarkan no_urut jika ada
  if (filter.no_urut && filter.no_urut !== '') {
    filteredPeserta = [...filteredPeserta].sort((a, b) => {
      const noUrutA = a.kodePerusahaan?.no_urut || 0;
      const noUrutB = b.kodePerusahaan?.no_urut || 0;
      
      if (filter.no_urut === 'asc') {
        return noUrutA - noUrutB; // Ascending (terlama)
      } else if (filter.no_urut === 'desc') {
        return noUrutB - noUrutA; // Descending (terbaru)
      }
      return 0;
    });
  }

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

  const handleVerifikasi = (id_sertif) => {
    setVerifId(id_sertif);
    setShowVerifModal(true);
  };

  const handleVerifikasiConfirm = async () => {
    if (!verifId) return;
    try {
      let ttdPath = null;
      if (verifData.tandaTangan) {
        const uploadRes = await uploadTandaTanganPeserta(verifId, verifData.tandaTangan);
        ttdPath = uploadRes.path;
      } else if (verifData.selectedSignaturePath) {
        ttdPath = verifData.selectedSignaturePath;
      }
      
      await updatePeserta(verifId, { 
        verifikasi: true,
        nama_penguji: verifData.namaPenguji,
        jabatan_penguji: verifData.jabatanPenguji,
        tgl_terbit_sertif: verifData.tanggalTerbit,
        ...(ttdPath ? { tandatangan: ttdPath } : {})
      });
      await refreshPeserta();
      setNotif('Peserta berhasil diverifikasi');
    } catch (error) {
      setNotif('Gagal verifikasi peserta: ' + error.message);
    }
    setShowVerifModal(false);
    setVerifId(null);
    setVerifData({
      namaPenguji: '',
      jabatanPenguji: '',
      tanggalTerbit: '',
      tandaTangan: null,
      selectedSignaturePath: null
    });
    setTimeout(() => setNotif(''), 2000);
  };

  const handleBulkVerifikasi = async () => {
    try {
      // Jika ada selectedBulkVerif, gunakan itu, jika tidak gunakan verifId tunggal
      const idsToVerify = selectedBulkVerif.length > 0 ? selectedBulkVerif : [verifId];
      
      // Filter hanya peserta yang belum diverifikasi
      const unverifiedIds = idsToVerify.filter(id => {
        const pesertaData = peserta.find(p => p.id_sertif === id);
        return pesertaData && !pesertaData.verifikasi;
      });
      
      if (unverifiedIds.length === 0) {
        setNotif('Tidak ada peserta yang perlu diverifikasi');
        setShowVerifModal(false);
        setVerifId(null);
        setSelectedBulkVerif([]);
        setVerifData({
          namaPenguji: '',
          jabatanPenguji: '',
          tanggalTerbit: '',
          tandaTangan: null
        });
        return;
      }
      
      // Upload tanda tangan jika ada (gunakan untuk semua peserta)
      let ttdPath = null;
      if (verifData.tandaTangan) {
        const uploadRes = await uploadTandaTanganPeserta(unverifiedIds[0], verifData.tandaTangan);
        ttdPath = uploadRes.path;
      } else if (verifData.selectedSignaturePath) {
        ttdPath = verifData.selectedSignaturePath;
      }
      
      // Update semua peserta yang belum diverifikasi
      await Promise.all(unverifiedIds.map(id => updatePeserta(id, { 
        verifikasi: true,
        nama_penguji: verifData.namaPenguji,
        jabatan_penguji: verifData.jabatanPenguji,
        tgl_terbit_sertif: verifData.tanggalTerbit,
        ...(ttdPath ? { tandatangan: ttdPath } : {})
      })));
      
      await refreshPeserta();
      setNotif(`${unverifiedIds.length} peserta berhasil diverifikasi`);
      
      // Reset state
      setShowVerifModal(false);
      setVerifId(null);
      setSelectedBulkVerif([]);
      setSelected([]); // Clear selection after bulk verify
      setVerifData({
        namaPenguji: '',
        jabatanPenguji: '',
        tanggalTerbit: '',
        tandaTangan: null,
        selectedSignaturePath: null
      });
    } catch (error) {
      setNotif('Gagal verifikasi peserta: ' + error.message);
    }
    setTimeout(() => setNotif(''), 3000);
  };

  const handleExcelPreviewConfirm = ({ file }) => {
    handleFinalUpload(file);
  };

  const handleFinalUpload = async (file, aktivitasKode) => {
    const formData = new FormData();
    formData.append('file', file);
    if (aktivitasKode) {
      formData.append('aktivitasKode', JSON.stringify(aktivitasKode));
    }
    try {
      const res = await fetch('http://localhost:5000/api/excel/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Excel berhasil diupload', { autoClose: 3000 });
        await refreshPeserta();
      } else {
        toast.error(data.message || 'Gagal upload', { autoClose: 3000 });
      }
    } catch (err) {
      toast.error('Gagal upload: ' + err.message, { autoClose: 3000 });
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
      } else if (generateData.selectedSignaturePath) {
        ttdPath = generateData.selectedSignaturePath;
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
      setTimeout(() => setNotif(''), 2500);
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
      } else if (generateData.selectedSignaturePath) {
        ttdPath = generateData.selectedSignaturePath;
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
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            Download PNG
          </a>
        )}
        {downloadLinks.zip && (
          <a
            href={downloadLinks.zip}
            download={`sertifikat-bulk.zip`}
            className="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-medium shadow"
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
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'upload', label: 'Upload Excel', icon: Upload, path: '/Uploadpeserta' },
    { id: 'aktivitas', label: 'Edit Form', icon: Settings, path: '/EditFormPage' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
      <ToastContainer position="top-center" autoClose={3000} />
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
        {sidebarVisible && (
          <Sidebar
            tab={tab}
            setTab={setTab}
            peserta={peserta}
            aktivitas={aktivitas}
            sidebarItems={sidebarItems}
            batchList={batchList}
            aktivitasAktif={aktivitasAktif}
            batchAktif={batchAktif}
            visible={sidebarVisible}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarVisible ? 'md:ml-72' : 'ml-0 w-full'}`}>
          {/* Download Buttons */}
          {renderDownloadButtons()}
          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
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
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white')
                      }
                      disabled={selected.length === 0 || isGenerating}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate Sertifikat</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBulkVerif(selected);
                        setShowVerifModal(true);
                      }}
                      className={
                        'px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ' +
                        (selected.length === 0 || selected.some(id => peserta.find(p => p.id_sertif === id)?.verifikasi)
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white')
                      }
                      disabled={selected.length === 0 || selected.some(id => peserta.find(p => p.id_sertif === id)?.verifikasi)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Verifikasi ({selected.length})</span>
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
                    sidebarVisible={sidebarVisible}
                    handleVerifikasi={handleVerifikasi}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {tab === 'upload' && (
            <UploadExcel
              onPreviewConfirm={handleExcelPreviewConfirm}
            />
          )}

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
                  refreshAktivitasAktif={refreshAktivitasAktif}
                />
              </div>
              <div className="flex-[0.9] h-full flex flex-col">
                <KelolaBatch
                  setNotif={setNotif}
                  batchList={batchList}
                  refreshBatchList={refreshBatchList}
                  refreshBatchAktif={refreshBatchAktif}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Generate Sertifikat */}
      {showGenerate && (
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isGenerating ? 'cursor-wait' : ''}`}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Generate Sertifikat</h3>
                <button
                  onClick={() => {
                    if (!isGenerating) {
                      setShowGenerate(false);
                      setGenerateData({
                        namaPenguji: '',
                        jabatanPenguji: '',
                        tanggalTerbit: '',
                        tandaTangan: null
                      });
                    }
                  }}
                  className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ${isGenerating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                  <label className="block text-gray-700 font-medium mb-1">Tanda Tangan</label>
                  <SignatureSelector
                    selectedSignature={generateData.selectedSignaturePath}
                    onSignatureSelect={(path) => setGenerateData({ ...generateData, selectedSignaturePath: path })}
                    onSignatureUpload={(file) => setGenerateData({ ...generateData, tandaTangan: file })}
                      disabled={isGenerating}
                    />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className={`flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${isGenerating ? 'cursor-wait opacity-75' : ''}`} disabled={isGenerating}>
                    {isGenerating ? 'Memproses...' : 'Generate'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (!isGenerating) {
                        setShowGenerate(false);
                        setGenerateData({
                          namaPenguji: '',
                          jabatanPenguji: '',
                          tanggalTerbit: '',
                          tandaTangan: null
                        });
                        setDownloadLinks(null);
                      }
                    }} 
                    className={`flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200 ${isGenerating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} 
                    disabled={isGenerating}
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



      {/* Modal Konfirmasi Verifikasi */}
      {showVerifModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedBulkVerif.length > 0 ? 'Verifikasi' : 'Verifikasi Peserta'}
                </h3>
                <button
                  onClick={() => {
                    setShowVerifModal(false);
                    setVerifId(null);
                    setSelectedBulkVerif([]);
                    setVerifData({
                      namaPenguji: '',
                      jabatanPenguji: '',
                      tanggalTerbit: '',
                      tandaTangan: null
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={async e => {
                e.preventDefault();
                if (selectedBulkVerif.length > 0) {
                  await handleBulkVerifikasi();
                } else {
                  await handleVerifikasiConfirm();
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Nama Penguji</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={verifData.namaPenguji} 
                    onChange={e => setVerifData({...verifData, namaPenguji: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Jabatan Penguji</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={verifData.jabatanPenguji} 
                    onChange={e => setVerifData({...verifData, jabatanPenguji: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tanggal Terbit</label>
                  <input 
                    type="date" 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={verifData.tanggalTerbit} 
                    onChange={e => setVerifData({...verifData, tanggalTerbit: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tanda Tangan</label>
                  <SignatureSelector
                    selectedSignature={verifData.selectedSignaturePath}
                    onSignatureSelect={(path) => setVerifData({ ...verifData, selectedSignaturePath: path })}
                    onSignatureUpload={(file) => setVerifData({ ...verifData, tandaTangan: file })}
                    showPreview={false}
                  />
                </div>
                
                <div className="mb-4 text-gray-700">
                  {selectedBulkVerif.length > 0 
                    ? (() => {
                        const unverifiedCount = selectedBulkVerif.filter(id => {
                          const pesertaData = peserta.find(p => p.id_sertif === id);
                          return pesertaData && !pesertaData.verifikasi;
                        }).length;
                        return `Akan memverifikasi ${unverifiedCount} dari ${selectedBulkVerif.length} peserta yang dipilih`;
                      })()
                    : 'Akan memverifikasi peserta ini'
                  }
                </div>
                
                <div className="flex space-x-3 pt-2">
                <button
                    type="submit" 
                    className={
                      'flex-1 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ' +
                      (selectedBulkVerif.length > 0 && selectedBulkVerif.every(id => {
                        const pesertaData = peserta.find(p => p.id_sertif === id);
                        return pesertaData && pesertaData.verifikasi;
                      })
                        ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white')
                    }
                    disabled={selectedBulkVerif.length > 0 && selectedBulkVerif.every(id => {
                      const pesertaData = peserta.find(p => p.id_sertif === id);
                      return pesertaData && pesertaData.verifikasi;
                    })}
                  >
                    Verifikasi
                  </button>
                <button
                    type="button" 
                    onClick={() => {
                      setShowVerifModal(false);
                      setVerifId(null);
                      setSelectedBulkVerif([]);
                      setVerifData({
                        namaPenguji: '',
                        jabatanPenguji: '',
                        tanggalTerbit: '',
                        tandaTangan: null
                      });
                    }} 
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
    </div>
  );
}

export default Dashboard;