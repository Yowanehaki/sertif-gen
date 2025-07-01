import api from '../api';

export const getAktivitas = async () => {
  const { data } = await api.get('/aktivitas');
  return data;
};

export const createAktivitas = async (nama) => {
  const { data } = await api.post('/aktivitas', { nama });
  return data;
};

export const updateAktivitas = async (oldNama, newNama) => {
  const { data } = await api.put('/aktivitas', { oldNama, newNama });
  return data;
};

export const deleteAktivitas = async (nama) => {
  const { data } = await api.delete('/aktivitas', { data: { nama } });
  return data;
};
