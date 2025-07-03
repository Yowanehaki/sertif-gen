import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
});

export default api;

export const getFormUserStatus = async () => {
  const res = await api.get('/service/settings/form-user');
  return res.data.aktif;
};

export const setFormUserStatus = async (aktif) => {
  const res = await api.post('/service/settings/form-user', { aktif });
  return res.data.aktif;
}; 