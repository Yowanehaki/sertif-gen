import api from './api';

export const getAktivitas = async () => {
  const { data } = await api.get('/aktivitas');
  return data;
};

export const createAktivitas = async (payload) => {
  const { data } = await api.post('/aktivitas', payload);
  return data;
};

export const updateAktivitas = async (payload) => {
  const { data } = await api.put('/aktivitas', payload);
  return data;
};

export const deleteAktivitas = async (id) => {
  const { data } = await api.delete('/aktivitas', { data: { id } });
  return data;
};

export const tambahAktivitas = async (nama, kode) => {
  const { data } = await api.post('/aktivitas', { nama, kode });
  return data;
}; 