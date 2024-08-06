import { useMemo } from 'react'

function useHasAnyPostPermission(userPermissions) {
  const hasAnyPermission = useMemo(() => {
    // Check if any of the permissions in userPermissions are true
    return Object.values(userPermissions).some((permission) => permission)
  }, [userPermissions])

  return hasAnyPermission
}

export default useHasAnyPostPermission
