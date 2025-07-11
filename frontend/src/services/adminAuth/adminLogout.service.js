import { removeCookie } from "../../utils/cookieUtils";

export const LogoutHandler = async () => {
    removeCookie("token");
    window.location.href = "/login";
  };