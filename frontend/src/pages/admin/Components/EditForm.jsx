import React, { useState } from 'react';
import { Settings, Edit, Trash2, Plus, X } from 'lucide-react';
import { createAktivitas, getAktivitas, updateAktivitas, deleteAktivitas } from '../../../services/dashboard/aktivitas.service.js';
import KelolaBatch from './KelolaBatch';
import { Switch } from '@headlessui/react';

const EditForm = ({ aktivitas, setAktivitas, editAktivitas, setEditAktivitas, setNotif }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentEditIdx, setCurrentEditIdx] = useState(null);
  const [currentDeleteIdx, setCurrentDeleteIdx] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editKode, setEditKode] = useState('');
  const [newKode, setNewKode] = useState('');

  const openEdit = (idx) => {
    setCurrentEditIdx(idx);
    setEditValue(aktivitas[idx].nama);
    setEditKode(aktivitas[idx].kode || '');
    setShowEdit(true);
  };
  const openDelete = (idx) => {
    setCurrentDeleteIdx(idx);
    setShowDelete(true);
  };
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (editValue) {
      const id = aktivitas[currentEditIdx].id;
      await updateAktivitas({ id, nama: editValue, kode: editKode });
      const data = await getAktivitas();
      setAktivitas(data);
    }
    setShowEdit(false);
  };
  const handleDeleteConfirm = async () => {
    const id = aktivitas[currentDeleteIdx].id;
    await deleteAktivitas(id);
    const data = await getAktivitas();
    setAktivitas(data);
    setShowDelete(false);
    if (setNotif) {
      setNotif('Aktivitas berhasil dihapus');
      setTimeout(() => setNotif(''), 2000);
    }
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    if(editAktivitas) {
      await createAktivitas({ nama: editAktivitas, kode: newKode });
      const data = await getAktivitas();
      setAktivitas(data);
      setNotif && setNotif('Aktivitas berhasil ditambahkan');
      setTimeout(() => {
        setNotif && setNotif('');
      }, 2000);
    }
    setEditAktivitas('');
    setNewKode('');
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 h-full">
      <div className="flex-[1.2] h-full flex flex-col">
        {/* Notifikasi di atas card */}
        {setNotif && setNotif.value && (
          <div className="mb-4 bg-green-100 text-green-800 px-6 py-3 rounded-xl shadow text-center text-sm font-medium">
            {setNotif.value}
          </div>
        )}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Kelola Form</h2>
            <p className="text-gray-600">Tambah, edit, atau hapus jenis aktivitas dan kode aktivitas</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              {aktivitas.map((a, idx) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                  <div>
                    <div className="font-medium text-gray-800">{a.nama}</div>
                    <div className="text-xs text-gray-500 flex gap-2 items-center">
                      <span>Kode: <span className="font-mono">{a.kode || '-'} </span></span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={a.aktif}
                      onChange={async (checked) => {
                        await updateAktivitas({ id: a.id, nama: a.nama, kode: a.kode, aktif: checked });
                        const data = await getAktivitas();
                        setAktivitas(data);
                      }}
                      className={`${a.aktif ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span className="sr-only">Aktifkan/Nonaktifkan</span>
                      <span
                        className={`${a.aktif ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                    <button type="button" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200" onClick={() => openEdit(idx)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => openDelete(idx)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleAdd}>
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
              <input
                type="text"
                className="w-25 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Kode"
                value={newKode}
                onChange={e => setNewKode(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Tambah
              </button>
            </form>
          </div>
        </div>
        {/* Modal Edit Aktivitas */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Edit Aktivitas</h3>
                  <button onClick={() => setShowEdit(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Nama Aktivitas</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={editValue} onChange={e => setEditValue(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Kode Aktivitas</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={editKode} onChange={e => setEditKode(e.target.value)} required />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">Simpan</button>
                    <button type="button" onClick={() => setShowEdit(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Modal Hapus Aktivitas */}
        {showDelete && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Hapus Aktivitas</h3>
                  <button onClick={() => setShowDelete(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-600">
                    Yakin ingin menghapus aktivitas <span className="font-semibold text-gray-800">{aktivitas[currentDeleteIdx]?.nama}</span>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={handleDeleteConfirm} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">Hapus</button>
                  <button onClick={() => setShowDelete(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-200">Batal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 h-full flex flex-col">
        <KelolaBatch setNotif={setNotif} />
      </div>
    </div>
  );
};

export default EditForm;