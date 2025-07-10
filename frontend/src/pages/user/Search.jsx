import React, { useState, useEffect } from 'react';
import { getPesertaById } from '../../services/dashboard/peserta.service';
import { Download, FileText, Image } from 'lucide-react';
import logo from '../../assets/logo.png';

function Search() {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { document.title = 'Cari Sertifikat'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!id.trim()) {
      setError('Masukkan ID anda');
      return;
    }
    setLoading(true);
    try {
      const data = await getPesertaById(id.trim());
      
      // Cek apakah peserta sudah diverifikasi
      if (!data.verifikasi) {
        setError('Data peserta tidak ditemukan.');
        setLoading(false);
        return;
      }
      
      setResult(data);
    } catch {
      setError('Data peserta tidak ditemukan.');
    }
    setLoading(false);
  };

  const handleDownload = async (format) => {
    if (!result) return;
    
    setDownloading(true);
    try {
      const response = await fetch(`http://localhost:5000/dashboard/${result.id_sertif}/${format === 'pdf' ? 'generate' : 'generate-png'}`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Gagal mengunduh sertifikat');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sertifikat-${result.id_sertif}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Gagal mengunduh sertifikat');
    }
    setDownloading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border-0 p-8 text-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-10 -translate-x-10 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-32 h-20 mx-auto mb-2">
              <img src={logo} alt="logo" className="w-full h-full object-contain opacity-80" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Mencari Sertifikat</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Masukkan ID Validasi"
                value={id}
                onChange={e => {
                  setId(e.target.value);
                  if (error) setError("");
                }}
                className="border rounded-lg px-4 py-2"
              />
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm text-left">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? 'Mencari...' : 'Cari'}
              </button>
            </form>
            {result && (
              <div className="mt-6 border-t pt-4 text-left">
                <h3 className="font-bold mb-2">Data Peserta</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-32 font-semibold text-gray-700">Nomor Sertifikat</div>
                    <div className="px-2 text-gray-700">:</div>
                    <div className="flex-1 text-gray-900">
                      {result.kodePerusahaan && result.kodePerusahaan.kode
                        ? `GRH/${result.kodePerusahaan.kode}/${result.tgl_submit ? new Date(result.tgl_submit).getFullYear() : new Date().getFullYear()}/${result.kodePerusahaan.batch}/${String(result.kodePerusahaan.no_urut).padStart(4, '0')}`
                        : 'Nomor belum tersedia'}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 font-semibold text-gray-700">Nama</div>
                    <div className="px-2 text-gray-700">:</div>
                    <div className="flex-1 text-gray-900">{result.nama}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 font-semibold text-gray-700">Aktivitas</div>
                    <div className="px-2 text-gray-700">:</div>
                    <div className="flex-1 text-gray-900">{result.aktivitas}</div>
                  </div>
                  {result.tgl_terbit_sertif && (
                    <div className="flex items-start">
                      <div className="w-32 font-semibold text-gray-700">Tanggal Diterbitkan</div>
                      <div className="px-2 text-gray-700">:</div>
                      <div className="flex-1 text-gray-900">{formatDate(result.tgl_terbit_sertif)}</div>
                    </div>
                  )}
                </div>
                
                {/* Tombol Download Sertifikat */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-bold mb-3 text-gray-800">Unduh Sertifikat</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload('pdf')}
                      disabled={downloading}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <FileText className="w-4 h-4" />
                      {downloading ? 'Mengunduh...' : 'PDF'}
                    </button>
                    <button
                      onClick={() => handleDownload('png')}
                      disabled={downloading}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <Image className="w-4 h-4" />
                      {downloading ? 'Mengunduh...' : 'PNG'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
