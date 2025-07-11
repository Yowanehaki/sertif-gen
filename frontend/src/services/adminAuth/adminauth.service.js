import axios from "axios";
import { setCookie } from "../../utils/cookieUtils";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const AdminAuthentication = async (event) => {
  event.preventDefault();
  const username = event.target.username.value;
  const password = event.target.password.value;

  const data = {
    username: username,
    password: password,
  };

  try {
    const baseUrl = serverUrl ? serverUrl.replace(/\/?$/, '/') : '/';
    const res = await axios.post(`${baseUrl}admin/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      alert(`${res.data.message || 'Login Berhasil'}`);
      setCookie("token", res.data.token, 1); // Store token in cookie for 1 day
      window.location.href = "/dashboard";
    }
  } catch (error) {
    alert(`Login gagal : ${error?.response?.data?.message || error.message}`);
  }
};