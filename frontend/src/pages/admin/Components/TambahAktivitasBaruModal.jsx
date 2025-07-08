import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TambahAktivitasBaruModal({ show, aktivitasBaru = [], onClose, onSubmit }) {
  const [kodeMap, setKodeMap] = useState({});
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleChange = (nama, kode) => {
    setKodeMap(prev => ({ ...prev, [nama]: kode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(
        aktivitasBaru.map(nama => ({ nama, kode: kodeMap[nama] || '' }))
      );
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Gagal menambah aktivitas');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-white/20">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Tambah Aktivitas Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {aktivitasBaru.map((nama, idx) => (
            <div key={idx} className="mb-2">
              <label className="block text-gray-700 font-medium mb-1">{nama}</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Kode Aktivitas"
                value={kodeMap[nama] || ''}
                onChange={e => handleChange(nama, e.target.value)}
                required
                disabled={loading}
              />
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" disabled={loading}>Batal</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
} 