import { useMemo } from 'react'

function useHasAnyPermission(givenPermissions, userPermissions) {
  const hasAnyPermission = useMemo(() => {
    // Check if any of the given permissions exist in the user's permissions
    return givenPermissions.some((permission) =>
      userPermissions.includes(permission)
    )
  }, [givenPermissions, userPermissions])

  return hasAnyPermission
}

export default useHasAnyPermission
