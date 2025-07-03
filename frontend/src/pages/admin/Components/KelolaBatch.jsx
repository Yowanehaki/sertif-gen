import React, { useState } from 'react';
import { Settings, Trash2, Plus } from 'lucide-react';
import { createBatch, updateBatch } from '../../../services/dashboard/batch.service.js';
import { Switch } from '@headlessui/react';

const KelolaBatch = ({ setNotif, batchList, onOpenDeleteBatch, refreshBatchList }) => {
  const [newBatch, setNewBatch] = useState('');
  const [searchBatch, setSearchBatch] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newBatch) {
      try {
        await createBatch(newBatch);
        await refreshBatchList();
        if (setNotif) {
          setNotif('Batch berhasil ditambahkan');
          setTimeout(() => setNotif(''), 2000);
        }
        setNewBatch('');
      } catch {
        if (setNotif) {
          setNotif('Batch sudah ada');
          setTimeout(() => setNotif(''), 2000);
        }
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg w-full h-full flex flex-col">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Kelola Batch</h2>
        <p className="text-gray-600">Tambah, edit, atau hapus batch peserta</p>
      </div>
      <div className="space-y-6">
        <input
          type="text"
          className="w-full mb-2 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Cari batch..."
          value={searchBatch}
          onChange={e => setSearchBatch(e.target.value)}
        />
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {[...batchList]
            .sort((a, b) => a.id - b.id)
            .filter(b => b.nama.toLowerCase().includes(searchBatch.toLowerCase()))
            .map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                <div className="font-medium text-gray-800">{b.nama}</div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={b.aktif}
                    onChange={async (checked) => {
                      await updateBatch(b.id, checked);
                      await refreshBatchList();
                    }}
                    className={`${b.aktif ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span className="sr-only">Aktifkan/Nonaktifkan</span>
                    <span
                      className={`${b.aktif ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <button
                    type="button"
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      if (b.aktif) {
                        if (setNotif) {
                          setNotif('Nonaktifkan batch ini terlebih dahulu sebelum menghapus.');
                          setTimeout(() => setNotif(''), 2000);
                        }
                        return;
                      }
                      onOpenDeleteBatch(b.id);
                    }}
                  >
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Batch baru..."
              value={newBatch}
              onChange={e => setNewBatch(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Tambah
          </button>
        </form>
      </div>
    </div>
  );
};

export default KelolaBatch;
