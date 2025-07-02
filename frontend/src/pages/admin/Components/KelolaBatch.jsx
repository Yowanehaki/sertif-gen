import React, { useState, useEffect } from 'react';
import { Settings, Edit, Trash2, Plus, X } from 'lucide-react';
import { getBatchList, createBatch, deleteBatch, updateBatch } from '../../../services/dashboard/batch.service.js';
import { Switch } from '@headlessui/react';

const KelolaBatch = ({ setNotif }) => {
  const [batchList, setBatchList] = useState([]);
  const [newBatch, setNewBatch] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [currentDeleteIdx, setCurrentDeleteIdx] = useState(null);

  useEffect(() => {
    getBatchList().then(setBatchList);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newBatch) {
      await createBatch(newBatch);
      const data = await getBatchList();
      setBatchList(data);
      setNotif && setNotif('Batch berhasil ditambahkan');
      setTimeout(() => setNotif && setNotif(''), 2000);
      setNewBatch('');
    }
  };
  const openDelete = (idx) => {
    setCurrentDeleteIdx(idx);
    setShowDelete(true);
  };
  const handleDeleteConfirm = async () => {
    const id = batchList[currentDeleteIdx].id;
    await deleteBatch(id);
    const data = await getBatchList();
    setBatchList(data);
    setShowDelete(false);
    setNotif && setNotif('Batch berhasil dihapus');
    setTimeout(() => setNotif && setNotif(''), 2000);
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
      <div className="space-y-0.5">
        <div className="space-y-3">
          {batchList.map((b, idx) => (
            <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
              <div className="font-medium text-gray-800">{b.nama}</div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={b.aktif}
                  onChange={async (checked) => {
                    await updateBatch(b.id, checked);
                    const data = await getBatchList();
                    setBatchList(data);
                  }}
                  className={`${b.aktif ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className="sr-only">Aktifkan/Nonaktifkan</span>
                  <span
                    className={`${b.aktif ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <button type="button" className="p-2 text-red-600 hover:bg-red-100 rounded-lg" onClick={() => openDelete(idx)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <form className="flex gap-3 flex-col md:flex-row items-stretch md:items-end" onSubmit={handleAdd}>
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
      {/* Modal Hapus Batch */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Hapus Batch</h3>
                <button onClick={() => setShowDelete(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600">
                  Yakin ingin menghapus batch <span className="font-semibold text-gray-800">{batchList[currentDeleteIdx].nama}</span>?
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
  );
};

export default KelolaBatch;
