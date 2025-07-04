import React, { useState } from 'react';
import { Search, Filter as FilterIcon, Calendar, ChevronDown } from 'lucide-react';

const Filter = ({ filter, setFilter, aktivitas, batches = [], noCard }) => {
  // State untuk pencarian dropdown
  const [searchAktivitas, setSearchAktivitas] = useState('');
  const [searchBatch, setSearchBatch] = useState('');
  const [showAktivitasList, setShowAktivitasList] = useState(false);
  const [showBatchList, setShowBatchList] = useState(false);

  // Filter list aktivitas dan batch sesuai input search
  const filteredAktivitas = aktivitas.filter(a => (a.nama || a).toLowerCase().includes(searchAktivitas.toLowerCase()));
  const filteredBatch = batches.filter(b => b.toLowerCase().includes(searchBatch.toLowerCase()));

  const filterForm = (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Input Nama */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari nama peserta..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={filter.nama}
          onChange={e => setFilter(f => ({ ...f, nama: e.target.value }))}
        />
      </div>
      {/* Input NoUrut */}
      <div className="relative w-32">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="NoUrut"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={filter.no_urut || ''}
          onChange={e => setFilter(f => ({ ...f, no_urut: e.target.value }))}
        />
      </div>
      {/* Dropdown Aktivitas Searchable */}
      <div className="relative min-w-48">
        <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari aktivitas..."
          className="pl-10 pr-8 py-3 border border-gray-200 rounded-t-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full bg-white"
          value={searchAktivitas}
          onFocus={() => setShowAktivitasList(true)}
          onChange={e => {
            setSearchAktivitas(e.target.value);
            setShowAktivitasList(true);
          }}
        />
        {showAktivitasList && (
          <div className="absolute left-0 right-0 bg-white border border-t-0 border-gray-200 rounded-b-xl max-h-40 overflow-y-auto z-20 shadow-lg">
            <div
              className="px-4 py-2 cursor-pointer hover:bg-blue-50"
              onClick={() => {
                setFilter(f => ({ ...f, aktivitas: '' }));
                setSearchAktivitas('');
                setShowAktivitasList(false);
              }}
            >
              Semua Aktivitas
            </div>
            {filteredAktivitas.map(a => (
              <div
                key={a.id || a}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  setFilter(f => ({ ...f, aktivitas: a.nama || a }));
                  setSearchAktivitas(a.nama || a);
                  setShowAktivitasList(false);
                }}
              >
                {a.nama || a}
              </div>
            ))}
          </div>
        )}
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>
      {/* Dropdown Batch Searchable */}
      <div className="relative min-w-32">
        <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari batch..."
          className="pl-10 pr-8 py-3 border border-gray-200 rounded-t-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full bg-white"
          value={searchBatch}
          onFocus={() => setShowBatchList(true)}
          onChange={e => {
            setSearchBatch(e.target.value);
            setShowBatchList(true);
          }}
        />
        {showBatchList && (
          <div className="absolute left-0 right-0 bg-white border border-t-0 border-gray-200 rounded-b-xl max-h-40 overflow-y-auto z-20 shadow-lg">
            <div
              className="px-4 py-2 cursor-pointer hover:bg-blue-50"
              onClick={() => {
                setFilter(f => ({ ...f, batch: '' }));
                setSearchBatch('');
                setShowBatchList(false);
              }}
            >
              Semua Batch
            </div>
            {filteredBatch.map(b => (
              <div
                key={b}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  setFilter(f => ({ ...f, batch: b }));
                  setSearchBatch(b);
                  setShowBatchList(false);
                }}
              >
                {b}
              </div>
            ))}
          </div>
        )}
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>
      {/* Input Tanggal */}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="date"
          className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={filter.tgl_submit}
          onChange={e => setFilter(f => ({ ...f, tgl: e.target.value }))}
        />
      </div>
    </div>
  );

  if (noCard) return filterForm;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-4">
      {filterForm}
    </div>
  );
};

export default Filter;
