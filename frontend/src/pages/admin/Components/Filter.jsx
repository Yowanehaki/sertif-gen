import React from 'react';
import { Search, Filter as FilterIcon, Calendar, ChevronDown } from 'lucide-react';

const Filter = ({ filter, setFilter, aktivitas }) => (
  <div className="flex flex-col md:flex-row gap-4">
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
    <div className="relative">
      <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <select
        className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white min-w-48"
        value={filter.aktivitas}
        onChange={e => setFilter(f => ({ ...f, aktivitas: e.target.value }))}
      >
        <option value="">Semua Aktivitas</option>
        {aktivitas.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="date"
        className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        value={filter.tgl}
        onChange={e => setFilter(f => ({ ...f, tgl: e.target.value }))}
      />
    </div>
  </div>
);

export default Filter;
