import api from './api';

export const uploadExcelPeserta = async (formData) => {
  const { data } = await api.post('/upload/excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}; 