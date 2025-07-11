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

export const updateKodePerusahaan = async (aktivitasList) => {
  const { data } = await api.post('/aktivitas/update-kode-perusahaan', { aktivitasList });
  return data;
};

export const getAktivitasAktif = async () => {
  const { data } = await api.get('/aktivitas/active');
  return data;
}; 