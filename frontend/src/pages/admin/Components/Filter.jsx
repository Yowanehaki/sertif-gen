import React, { useState } from 'react';
import { Search, Filter as FilterIcon, Calendar, ChevronDown } from 'lucide-react';

const SearchableDropdown = ({ options, value, onChange, placeholder = '', minWidth = 'min-w-48' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = options.filter(opt => (opt.nama || opt).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className={`relative ${minWidth}`} tabIndex={0} onBlur={() => setOpen(false)}>
      <div
        className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer flex items-center"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex-1 truncate text-gray-700">{value || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
      </div>
      {open && (
        <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-xl mt-2 z-20 shadow-lg max-h-56 overflow-y-auto">
          <input
            autoFocus
            type="text"
            className="w-full px-3 py-2 border-b border-gray-100 focus:outline-none"
            placeholder={`Cari ${placeholder.toLowerCase()}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
          <div className="max-h-40 overflow-y-auto">
            <div
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${!value ? 'font-semibold text-blue-600' : ''}`}
              onClick={() => { onChange(''); setOpen(false); setSearch(''); }}
            >
              Semua {placeholder}
            </div>
            {filtered.length === 0 && <div className="px-4 py-2 text-gray-400">Tidak ditemukan</div>}
            {filtered.map(opt => (
              <div
                key={opt.id || opt}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${value === (opt.nama || opt) ? 'bg-blue-100 font-semibold' : ''}`}
                onClick={() => { onChange(opt.nama || opt); setOpen(false); setSearch(''); }}
              >
                {opt.nama || opt}
              </div>
            ))}
          </div>
        </div>
      )}
      <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    </div>
  );
};

const Filter = ({ filter, setFilter, aktivitas, batches = [], noCard }) => {
  const filterForm = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex gap-2 items-center">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama peserta..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 max-w-xs"
            value={filter.nama}
            onChange={e => setFilter(f => ({ ...f, nama: e.target.value }))}
          />
        </div>
        <div className="relative w-24">
          <input
            type="number"
            placeholder="No. Urut"
            className="w-full pl-3 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            value={filter.no_urut || ''}
            onChange={e => setFilter(f => ({ ...f, no_urut: e.target.value }))}
            min={1}
          />
        </div>
      </div>
      <SearchableDropdown
        options={aktivitas}
        value={filter.aktivitas}
        onChange={val => setFilter(f => ({ ...f, aktivitas: val }))}
        placeholder="Aktivitas"
        minWidth="min-w-48"
      />
      <SearchableDropdown
        options={batches}
        value={filter.batch}
        onChange={val => setFilter(f => ({ ...f, batch: val }))}
        placeholder="Batch"
        minWidth="min-w-32"
      />
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
