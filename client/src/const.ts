export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "E.desmet";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO || "/EDES.png";

// Simple Auth: Login URL points to /login
export const getLoginUrl = () => "/login";