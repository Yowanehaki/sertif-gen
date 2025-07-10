import React from 'react';
import { X } from 'lucide-react';

function EditPeserta({ show, onClose, editData, setEditData, onSave, aktivitas, batchList = [] }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Edit Peserta</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={onSave}>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={editData?.email || ''}
                  onChange={e => setEditData({...editData, email: e.target.value})}
                  placeholder="Masukkan email atau '-' jika kosong"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No Telp</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={editData?.no_telp || ''}
                  onChange={e => {
                    const value = e.target.value;
                    // Jika value adalah '-', izinkan
                    if (value === '-') {
                      setEditData({...editData, no_telp: value});
                      return;
                    }
                    // Hapus semua karakter non-angka
                    const cleanValue = value.replace(/[^0-9]/g, '');
                    // Batasi panjang maksimal 13 digit
                    const limitedValue = cleanValue.slice(0, 13);
                    setEditData({...editData, no_telp: limitedValue});
                  }}
                  placeholder="Contoh: 081234567890 atau '-' jika kosong"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aktivitas</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={editData?.aktivitas || ''}
                  onChange={e => setEditData({...editData, aktivitas: e.target.value})}
                >
                  {aktivitas.map(a => (
                    <option key={a.id || a} value={a.nama || a}>
                      {a.nama || a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={editData?.kodePerusahaan?.batch || ''}
                  onChange={e => setEditData({
                    ...editData,
                    kodePerusahaan: {
                      ...editData.kodePerusahaan,
                      batch: e.target.value
                    }
                  })}
                  required
                >
                  <option value="" disabled>Pilih batch</option>
                  {batchList.map(b => (
                    <option key={b.id} value={b.nama}>{b.nama}</option>
                  ))}
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
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPeserta;