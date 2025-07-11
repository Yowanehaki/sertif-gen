import React, { useState } from 'react';
import { Settings, Edit, Trash2, Plus, X } from 'lucide-react';
import { createAktivitas, getAktivitas, updateAktivitas } from '../../../services/dashboard/aktivitas.service.js';
import { Switch } from '@headlessui/react';

const EditForm = ({ aktivitas, setAktivitas, editAktivitas, setEditAktivitas, setNotif, aktivitasBaru = [], refreshAktivitasAktif, onOpenEdit, onOpenDelete }) => {
  const [newKode, setNewKode] = useState('');
  const [searchAktivitas, setSearchAktivitas] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if(editAktivitas) {
      try {
        await createAktivitas({ nama: editAktivitas, kode: newKode });
        const data = await getAktivitas();
        setAktivitas(data);
        if (refreshAktivitasAktif) await refreshAktivitasAktif();
        setNotif && setNotif('Aktivitas berhasil ditambahkan');
        setTimeout(() => {
          setNotif && setNotif('');
        }, 2000);
      } catch {
        if (setNotif) {
          setNotif('Aktivitas sudah ada');
          setTimeout(() => setNotif(''), 2000);
        }
      }
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Kelola Aktivitas</h2>
            <p className="text-gray-600">Tambah, edit, atau hapus jenis aktivitas dan kode aktivitas</p>
          </div>
          <div className="space-y-6">
            {/* Filter/Search */}
            <input
              type="text"
              className="w-full mb-2 px-4 py-2 border-2 border-gray-500 rounded-xl  focus:border-transparent transition-all duration-200"
              placeholder="Cari aktivitas..."
              value={searchAktivitas}
              onChange={e => setSearchAktivitas(e.target.value)}
            />
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {aktivitas
                .filter(a =>
                  a.nama.toLowerCase().includes(searchAktivitas.toLowerCase()) ||
                  (a.kode || '').toLowerCase().includes(searchAktivitas.toLowerCase())
                )
                .map((a, idx) => {
                  // Jika aktivitasBaru mengandung nama aktivitas ini, paksa aktif=false
                  const isBaru = aktivitasBaru.includes(a.nama);
                  return (
                    <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                      <div>
                        <div className="font-medium text-gray-800">{a.nama}</div>
                        <div className="text-xs text-gray-500 flex gap-2 items-center">
                          <span>Kode: <span className="font-mono">{a.kode || '-'} </span></span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isBaru ? false : a.aktif}
                          onChange={async (checked) => {
                            if (isBaru && checked) return; // Tidak bisa diaktifkan langsung
                            await updateAktivitas({ id: a.id, nama: a.nama, kode: a.kode, aktif: checked });
                            const data = await getAktivitas();
                            setAktivitas(data);
                            if (refreshAktivitasAktif) await refreshAktivitasAktif();
                          }}
                          className={`${isBaru ? 'bg-gray-300' : (a.aktif ? 'bg-green-500' : 'bg-gray-300')} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                          <span className="sr-only">Aktifkan/Nonaktifkan</span>
                          <span
                            className={`${isBaru ? 'translate-x-1' : (a.aktif ? 'translate-x-6' : 'translate-x-1')} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                        <button type="button" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200" onClick={() => onOpenEdit(idx)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => onOpenDelete(idx)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            <form className="flex gap-2" onSubmit={handleAdd}>
              <div className="relative flex-1">
                <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border-1 border-gray-700 rounded-xl focus:border-transparent transition-all duration-200"
                  placeholder="Nama aktivitas baru..."
                  value={editAktivitas}
                  onChange={e => setEditAktivitas(e.target.value)}
                />
              </div>
              <input
                type="text"
                className="w-25 px-3 py-3 border-1 border-gray-700 rounded-xl focus:border-transparent transition-all duration-200"
                placeholder="Kode"
                value={newKode}
                onChange={e => setNewKode(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-red-600 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Tambah
              </button>
            </form>
          </div>
        </div>
        {/* Modal Edit Aktivitas */}
        {/* Modal Hapus Aktivitas */}
      </div>
    </div>
  );
};

export default EditForm;