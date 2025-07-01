import api from '../api';

export const generateCertificate = async (id_sertif, payload) => {
  const { data } = await api.put(`/dashboard/${id_sertif}/generate`, payload);
  return data;
};

export const uploadSignature = async (formData) => {
  const { data } = await api.post('/upload/signature', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const downloadCertificate = async (filename) => {
  const response = await api.get(`/download/certificate/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
};
