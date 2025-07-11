import React, { useState, useEffect } from 'react';
import { Upload, X, Trash2, Check } from 'lucide-react';
import { saveSignature, getSavedSignatures, deleteSavedSignature } from '../../../services/dashboard/peserta.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignatureSelector = ({ 
  selectedSignature, 
  onSignatureSelect, 
  disabled = false 
}) => {
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [customName, setCustomName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadSavedSignatures();
  }, []);

  const loadSavedSignatures = async () => {
    try {
      setLoading(true);
      const response = await getSavedSignatures();
      setSavedSignatures(response.signatures || []);
    } catch (error) {
      console.error('Error loading signatures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (customName) => {
    if (!uploadFile) return;
    
    try {
      setUploading(true);
      const result = await saveSignature(uploadFile, customName);
      
      // Add new signature to list
      setSavedSignatures(prev => [{
        filename: result.filename,
        path: result.path,
        url: `/uploads/signatures/${result.filename}`,
        createdAt: new Date()
      }, ...prev]);
      
      // Select the newly uploaded signature
      onSignatureSelect(result.path);
      
      setShowUploadModal(false);
      setUploadFile(null);
      setCustomName("");
    } catch (error) {
      console.error('Error uploading signature:', error);
      alert('Gagal mengupload tanda tangan: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSignature = async () => {
    if (!selectedSignature) return;
    try {
      setLoading(true);
      // Ambil nama file dari path
      const match = selectedSignature.replace(/\\/g, '/').match(/([^/]+)$/);
      const filename = match ? match[1] : null;
      if (!filename) throw new Error('Nama file tidak valid');
      await deleteSavedSignature(filename);
      setSavedSignatures(prev => prev.filter(sig => sig.filename !== filename));
      onSignatureSelect(null);
      toast.success('Tanda tangan berhasil dihapus!');
    } catch (error) {
      toast.error('Gagal menghapus tanda tangan: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected Signature Preview */}
      {selectedSignature && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
          {(() => {
            // Normalisasi path agar selalu pakai slash dan diawali /
            let normalizedPath = selectedSignature.replace(/\\/g, '/').replace(/\+/g, '/');
            if (!normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;
            return (
              <img
                src={`http://localhost:5000${normalizedPath}`}
                alt="Selected Signature"
                className="h-12 border rounded shadow"
                style={{ maxWidth: 120, objectFit: 'contain' }}
              />
            );
          })()}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{(() => {
              // Tampilkan hanya nama file
              const match = selectedSignature.replace(/\\/g, '/').match(/([^/]+)$/);
              return match ? match[1] : selectedSignature;
            })()}</p>
            <p className="text-xs text-gray-500">Tanda tangan terpilih</p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={disabled || loading}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Hapus tanda tangan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onSignatureSelect(null)}
            disabled={disabled}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Batal pilih"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-white/20">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Konfirmasi Hapus</h3>
              <p className="mb-6 text-gray-700">Yakin ingin menghapus tanda tangan ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteSignature}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  disabled={loading}
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Signature Selection */}
      <div className="flex items-center gap-3">
        <select
          value={selectedSignature || ''}
          onChange={(e) => onSignatureSelect(e.target.value || null)}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
        >
          <option value="">Pilih tanda tangan</option>
          {savedSignatures.map((signature) => (
            <option key={signature.filename} value={signature.path}>
              {signature.filename}
            </option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          disabled={disabled}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Upload Tanda Tangan</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setCustomName("");
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih File Tanda Tangan
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama File (tanpa .png)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Contoh: ttd_trainer1"
                  maxLength={40}
                />
              </div>
              
              {uploadFile && (
                <div className="flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(uploadFile)}
                    alt="Preview"
                    className="h-16 border rounded"
                    style={{ maxWidth: 120, objectFit: 'contain' }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{uploadFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                    setCustomName("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleFileUpload(customName)}
                  disabled={!uploadFile || uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Mengupload...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default SignatureSelector; 