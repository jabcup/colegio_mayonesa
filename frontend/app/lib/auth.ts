import Cookies from "js-cookie";

export function getAuthData() {
  return {
    rol: Cookies.get("usuario_rol"),
    idPersonal: Cookies.get("personal_id"),
    usuarioId: Cookies.get("usuario_id"),
  };
}
