import React from 'react';

function Sidebar({ tab, setTab, peserta, aktivitas, sidebarItems }) {
  return (
    <aside className="w-72 min-h-screen h-full bg-white/70 backdrop-blur-sm border-r border-white/20 p-6 hidden md:block fixed left-0 top-0 md:top-20 z-30">
      <div className="space-y-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                tab === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
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
        <h3 className="font-semibold text-gray-800 mb-3">Statistik Cepat</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Peserta</span>
            <span className="font-semibold text-blue-600">{peserta.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hadir</span>
            <span className="font-semibold text-green-600">
              {peserta.filter(p => p.status === 'Hadir').length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Aktivitas</span>
            <span className="font-semibold text-purple-600">{aktivitas.length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
