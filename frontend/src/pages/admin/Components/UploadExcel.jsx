import React from 'react';
import { Upload, Download } from 'lucide-react';

function UploadExcel() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Data Peserta</h2>
          <p className="text-gray-600">Upload file Excel untuk menambah peserta secara bulk</p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag & drop file Excel atau klik untuk browse</p>
            <input type="file" accept=".xlsx,.xls" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-block transition-colors duration-200">
              Pilih File
            </label>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Download className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium mb-1">Template Excel</p>
                <p className="text-blue-600 text-sm mb-2">Download template untuk format yang benar</p>
                <a href="/template.xlsx" download className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Download Template
                </a>
              </div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Upload Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadExcel; 