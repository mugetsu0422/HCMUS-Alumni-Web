import Cookies from 'js-cookie'

function useAuth() {
  // Check if the JWT exists in the cookies
  const jwt = Cookies.get('jwt')
  const isLoggedIn = Boolean(jwt)
  const userId = Cookies.get('userId') || null

  return { isLoggedIn, jwt, userId }
}

export default useAuth
