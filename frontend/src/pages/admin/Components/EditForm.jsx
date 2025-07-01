import React from 'react';
import { Settings, Edit, Trash2, Plus } from 'lucide-react';

const EditForm = ({ aktivitas, setAktivitas, editAktivitas, setEditAktivitas }) => (
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
);

export default EditForm; 