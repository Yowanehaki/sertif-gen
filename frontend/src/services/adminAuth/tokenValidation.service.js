import { jwtDecode } from "jwt-decode";
import { getCookie } from "../../utils/cookieUtils";

export const isTokenValid = () => {
  const token = getCookie("token");
  try {
    const decodeToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodeToken.exp > currentTime;
  } catch {
    // console.error("Error decoding token:", error);
    return false;
  }
};