import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApolloError, ServerError, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import * as meQuery from '../queries/me';
import { authCheck } from '../authCheck';
import { AuthRole, NullableUser } from '../Types';
import jsCookie from 'js-cookie';

const AuthContext = createContext<NullableUser>(null);

interface PropTypes {
  children: JSX.Element[] | JSX.Element;
}

function AuthProvider({ children }: PropTypes) {
  const { data, loading, error } = useQuery<meQuery.Me, null>(meQuery.QUERY);

  if (typeof window !== 'undefined') {
    (window as any).x = error;
  }

  if (
    error &&
    error instanceof ApolloError &&
    error.networkError &&
    'result' in error.networkError &&
    (error.networkError as ServerError).result.errors[0].extensions.code === 'UNAUTHENTICATED' &&
    typeof window !== 'undefined'
  ) {
    jsCookie.remove('token');
  }

  return <AuthContext.Provider value={data ? data.me : null}>{children}</AuthContext.Provider>;
}

const useAuth: (authRole: AuthRole) => NullableUser = (authRole) => {
  const user = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    const redirectUrl = authCheck(user, authRole);
    if (redirectUrl) {
      router.replace(redirectUrl);
    }
  }, [user]);

  return user;
};

const useCurrentUser: () => NullableUser = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth, useCurrentUser };
