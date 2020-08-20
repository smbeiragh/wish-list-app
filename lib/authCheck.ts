import { AuthRole, NullableUser } from './Types';

export function authCheck(user: NullableUser, authRole: AuthRole): string | null {
  if (authRole === 'Authenticated' && !user) {
    return '/login';
  } else if (authRole === 'NotAuthenticated' && user) {
    return '/profile';
  }
  return null;
}
