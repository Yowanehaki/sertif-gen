import React from 'react';
import { X, Trash2 } from 'lucide-react';

const HapusPeserta = ({ show, onClose, onDelete, selected, peserta }) => {
  if (!show) return null;
  let content;
  if (selected.length > 1) {
    content = (
      <p className="text-gray-600">
        Yakin ingin menghapus <span className="font-semibold text-gray-800">{selected.length} peserta terpilih</span>?
      </p>
    );
  } else {
    const namaPeserta = peserta.find(p => p.id_sertif === selected[0])?.nama;
    content = (
      <p className="text-gray-600">
        Yakin ingin menghapus peserta <span className="font-semibold text-gray-800">{namaPeserta}</span>?
      </p>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Hapus Peserta</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            {content}
            <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              Hapus
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HapusPeserta; 