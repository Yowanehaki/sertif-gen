import React from 'react';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useState } from 'react';

export default function UploadExcel({ onAktivitasBaru }) {
  const [previewData, setPreviewData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Ambil header dan data saja
      setPreviewData(json);
      setShowModal(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const res = await fetch('http://localhost:5000/api/excel/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          if (data.data.aktivitasBaru && data.data.aktivitasBaru.length > 0 && onAktivitasBaru) {
            onAktivitasBaru(data.data.aktivitasBaru);
          }
        } else {
          alert(data.message || 'Gagal upload');
        }
      } catch (err) {
        alert('Gagal upload: ' + err.message);
      }
      setShowModal(false);
      setSelectedFile(null);
      setPreviewData([]);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewData([]);
  };

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
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" id="file-upload" />
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
                <a href="http://localhost:5000/api/excel/template" download className="text-blue-600 hover:text-blue-700 font-medium underline">
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

      {/* Modal konfirmasi preview */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Konfirmasi Data Excel</h3>
            <div className="overflow-x-auto max-h-64 mb-4">
              <table className="min-w-full text-xs border">
                <thead>
                  <tr>
                    {previewData[0]?.map((h, i) => (
                      <th key={i} className="border px-2 py-1 bg-gray-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border px-2 py-1">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Batal</button>
              <button onClick={handleConfirmUpload} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Lanjutkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 