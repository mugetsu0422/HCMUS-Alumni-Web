import Cookies from 'js-cookie'

export default function isAdminLogin() {
  return     Cookies.get('roleIds') === "1"

}
