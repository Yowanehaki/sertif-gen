import React, { useState } from 'react';
import { Edit, Trash2, FileText, Download } from 'lucide-react';

const TabelPeserta = ({
  filteredPeserta,
  selected,
  handleSelect,
  handleSelectAll,
  handleEdit,
  handleDelete
}) => {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (id_sertif) => {
    setDownloadingId(id_sertif);
    try {
      const res = await fetch(`http://localhost:5000/dashboard/${id_sertif}/generate`, { method: 'POST' });
      if (!res.ok) throw new Error('Gagal generate sertifikat');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sertifikat-${id_sertif}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal generate sertifikat: ' + err.message);
    }
    setDownloadingId(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-600 to-gray-600 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={selected.length === filteredPeserta.length && filteredPeserta.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left font-semibold text-white">ID Sertif</th>
              <th className="p-4 text-left font-semibold text-white">Nama</th>
              <th className="p-4 text-left font-semibold text-white w-60">Aktivitas</th>
              <th className="p-4 text-left font-semibold text-white">Batch</th>
              <th className="p-4 text-left font-semibold text-white">Tanggal Submit</th>
              <th className="p-4 text-left font-semibold text-white">Status</th>
              <th className="p-4 text-left font-semibold text-white">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeserta.map((row, index) => (
              <tr key={row.id_sertif} className={`border-b border-gray-300 hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={selected.includes(row.id_sertif)}
                    onChange={() => handleSelect(row.id_sertif)}
                  />
                </td>
                <td className="p-4 font-mono text-xs text-gray-900">{row.id_sertif}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{row.nama}</div>
                </td>
                <td className="p-4 text-gray-900 break-words max-w-xs">{row.aktivitas}</td>
                <td className="p-4 text-gray-900 break-words max-w-xs">{row.batch || '-'}</td>
                <td className="p-4 text-gray-600">{row.tgl_submit ? new Date(row.tgl_submit).toLocaleDateString() : '-'}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    row.konfirmasi_hadir ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {row.konfirmasi_hadir ? 'Hadir' : 'Tidak Hadir'}
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
                    <button
                      onClick={() => handleDownload(row.id_sertif)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                      disabled={downloadingId === row.id_sertif}
                      title="Download Sertifikat PDF"
                    >
                      {downloadingId === row.id_sertif ? (
                        <span className="animate-spin"><Download className="w-4 h-4" /></span>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
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