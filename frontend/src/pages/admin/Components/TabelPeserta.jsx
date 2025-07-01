import React from 'react';
import { Edit, Trash2, FileText } from 'lucide-react';

const TabelPeserta = ({
  filteredPeserta,
  selected,
  handleSelect,
  handleSelectAll,
  handleEdit,
  handleDelete
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={selected.length === filteredPeserta.length && filteredPeserta.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left font-semibold text-gray-700">ID</th>
              <th className="p-4 text-left font-semibold text-gray-700">Nama</th>
              <th className="p-4 text-left font-semibold text-gray-700">Email</th>
              <th className="p-4 text-left font-semibold text-gray-700">Aktivitas</th>
              <th className="p-4 text-left font-semibold text-gray-700">Tanggal</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeserta.map((row, index) => (
              <tr key={row.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}>
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={selected.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                  />
                </td>
                <td className="p-4 font-medium text-gray-900">#{row.id}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{row.nama}</div>
                </td>
                <td className="p-4 text-gray-600">{row.email}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {row.aktivitas}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{row.tgl}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    row.status === 'Hadir' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelPeserta; 