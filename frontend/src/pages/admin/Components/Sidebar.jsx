import React from 'react';

function Sidebar({ tab, setTab, peserta, aktivitas, sidebarItems, aktivitasBaru = [], batchList = [], aktivitasAktif = [], batchAktif = [], visible = true }) {
  return (
    <aside
      className={
        `w-72 min-h-screen h-full bg-white/70 backdrop-blur-sm border-r border-white/20 p-6 fixed left-0 top-0 md:top-20 z-30 transition-all duration-500 ease-in-out
        ${visible ? 'md:translate-x-0 md:opacity-100 md:pointer-events-auto' : 'md:-translate-x-full md:opacity-0 md:pointer-events-none'}
        hidden md:block`
      }
    >
      <div className="space-y-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                tab === item.id
                  ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-3">Statistik</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Peserta</span>
            <span className="font-semibold text-blue-600">{peserta.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Jumlah Batch</span>
            <span className="font-semibold text-pink-600">{batchList.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Aktivitas</span>
            <span className="font-semibold text-purple-600">{aktivitas.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Aktivitas Aktif</span>
            <span className="font-semibold text-green-600">{aktivitasAktif.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Batch Aktif</span>
            <span className="font-semibold text-green-600">{batchAktif.length}</span>
          </div>
        </div>
      </div>
      {/* Warning aktivitas baru */}
      {aktivitasBaru && aktivitasBaru.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-800 animate-pulse">
          <div className="font-bold mb-2">Peringatan Aktivitas Baru!</div>
          <div className="text-sm mb-1">Aktivitas berikut belum terdaftar:</div>
          <ul className="list-disc ml-5 text-sm">
            {aktivitasBaru.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          <div className="mt-2 text-xs">Silakan daftarkan aktivitas & kode-nya di menu <b>Kelola Aktivitas</b> sebelum generate sertifikat.</div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
