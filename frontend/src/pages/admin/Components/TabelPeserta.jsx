import React from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';

const TabelPeserta = ({
  filteredPeserta,
  selected,
  handleSelect,
  handleSelectAll,
  handleEdit,
  handleDeleteSingle,
  sidebarVisible,
  handleVerifikasi
}) => {

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
      {/* Scroll hanya pada tabel, bukan dashboard */}
      <div className="relative">
        <div
          className="overflow-x-auto overflow-y-auto pr-4"
          style={{
            maxHeight: 700,
            maxWidth: sidebarVisible ? 'calc(100vw - 320px - 48px)' : '100vw'
          }}
        >
          <table className="bg-white min-w-[1150px]" style={{ fontFamily: "'Roboto', sans-serif" }}>
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
                <th className="p-4 text-left font-semibold text-white">ID</th>
                <th className="p-4 text-left font-semibold text-white w-32">Nama</th>
                <th className="p-4 text-left font-semibold text-white w-56">Email</th>
                <th className="p-4 text-left font-semibold text-white w-40">No Telp</th>
                <th className="p-4 text-left font-semibold text-white w-[260px]">Aktivitas</th>
                <th className="p-4 text-left font-semibold text-white">Kode Perusahaan</th>
                <th className="p-4 text-left font-semibold text-white">Tanggal Submit</th>
                <th className="p-4 text-left font-semibold text-white">Verifikasi</th>
                <th className="p-4 text-left font-semibold text-white">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeserta.map((row, index) => {
                // Generate kode perusahaan lengkap
                const tahun = row.tgl_submit ? new Date(row.tgl_submit).getFullYear() : new Date().getFullYear();
                const kodePerusahaanLengkap = row.kodePerusahaan && row.kodePerusahaan.kode 
                  ? `GRH/${row.kodePerusahaan.kode}/${tahun}/${row.kodePerusahaan.batch}/${String(row.kodePerusahaan.no_urut).padStart(4, '0')}`
                  : 'Kode belum tersedia';
                
                return (
                  <tr
                    key={row.id_sertif}
                    className={`border-b border-gray-300 hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={e => {
                      // Cegah trigger jika klik di tombol aksi
                      if (
                        e.target.closest('button') ||
                        e.target.tagName === 'BUTTON' ||
                        e.target.closest('input[type="checkbox"]')
                      ) return;
                      handleSelect(row.id_sertif);
                    }}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selected.includes(row.id_sertif)}
                        onChange={() => handleSelect(row.id_sertif)}
                      />
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-900">{row.id_sertif}</td>
                    <td className="p-4 min-w-[180px]">
                      <div className="font-medium text-gray-900">{row.nama}</div>
                    </td>
                    <td className="p-4 text-gray-900 break-words max-w-xs">{row.email}</td>
                    <td className="p-4 text-gray-900">
                      {row.no_telp && row.no_telp !== '-' ? row.no_telp : ''}
                    </td>
                    <td className="p-4 text-gray-900 break-words min-w-[220px] max-w-[260px]">{row.aktivitas}</td>
                    <td className="p-4 text-gray-900 break-words max-w-xs">
                      <div className="text-sm">
                        {kodePerusahaanLengkap === 'Kode belum tersedia' ? (
                          <span className="text-orange-600 font-medium">Kode belum tersedia</span>
                        ) : (
                          <span className="font-mono text-sm">{kodePerusahaanLengkap}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{row.tgl_submit ? (() => {
                      const d = new Date(row.tgl_submit);
                      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                    })() : '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        row.verifikasi ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      }`}>
                        {row.verifikasi ? 'Terverifikasi' : 'Belum Diverifikasi'}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex space-x-2">
                        {row.verifikasi ? (
                          <button
                            className="p-2 bg-gray-200 text-gray-400 cursor-not-allowed rounded-lg transition-colors duration-200"
                            disabled={true}
                            title="Sudah diverifikasi"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifikasi(row.id_sertif)}
                            className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200"
                            title="Verifikasi"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(row)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(row.id_sertif)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabelPeserta; 