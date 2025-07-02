import api from './api';

export const getPeserta = async (params) => {
  const { data } = await api.get('/dashboard', { params });
  return data;
};

export const getPesertaById = async (id_sertif) => {
  const { data } = await api.get(`/dashboard/${id_sertif}`);
  return data;
};

export const createPeserta = async (payload) => {
  const { data } = await api.post('/dashboard', payload);
  return data;
};

export const updatePeserta = async (id_sertif, payload) => {
  const { data } = await api.put(`/dashboard/${id_sertif}`, payload);
  return data;
};

export const deletePeserta = async (id_sertif) => {
  const { data } = await api.delete(`/dashboard/${id_sertif}`);
  return data;
};

export const bulkDeletePeserta = async (ids) => {
  const { data } = await api.post('/dashboard/bulk-delete', { ids });
  return data;
};

export const generateSertifikat = async (id_sertif, payload) => {
  const { data } = await api.put(`/dashboard/${id_sertif}/generate`, payload);
  return data;
}; 