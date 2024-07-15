import Cookies from 'js-cookie'

export default function checkPermission(permission) {
  const permissionsCookie = Cookies.get('permissions')
  const permissions = permissionsCookie ? permissionsCookie.split(',') : []
  const hasPermission = permissions.includes(permission)

  return hasPermission
}
