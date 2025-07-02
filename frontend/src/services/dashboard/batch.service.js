import api from './api';

export const getBatchList = async () => {
  const res = await api.get('/batch');
  return res.data;
};

export const createBatch = async (nama) => {
  const res = await api.post('/batch', { nama });
  return res.data;
};

export const deleteBatch = async (id) => {
  const res = await api.delete('/batch', { data: { id } });
  return res.data;
};

export const updateBatch = async (id, aktif) => {
  const res = await api.patch('/batch', { id, aktif });
  return res.data;
};
