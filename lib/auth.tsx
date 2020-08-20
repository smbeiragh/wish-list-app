import { NextPageContext } from 'next';
import { ApolloCache, ApolloClient, InMemoryCache } from '@apollo/client';
import * as meQuery from './queries/me';
import { AuthRole, NullableUser } from './Types';
import { authCheck } from './authCheck';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { ApolloError, ServerError } from '@apollo/client';
import { destroyCookie } from 'nookies';

export type NextPageContextWithApollo = NextPageContext & { apolloClient: ApolloClient<ApolloCache<InMemoryCache>> };

export async function getUserInServer(ctx: NextPageContextWithApollo): Promise<NullableUser> {
  let result;
  try {
    result = await ctx.apolloClient.query<meQuery.Me, null>({ query: meQuery.QUERY });
    if (result && result.data) {
      return result.data.me;
    }
  } catch (e) {
    if (e instanceof ApolloError && e.networkError && 'result' in e.networkError) {
      if ((e.networkError as ServerError).result.errors[0].extensions.code === 'UNAUTHENTICATED') {
        destroyCookie(ctx, 'token');
      }
    } else {
      throw e;
    }
  }
  return null;
}

export function serverAuth(authRole: AuthRole) {
  return async (ctx: NextPageContextWithApollo) => {
    if (ctx && ctx.res) {
      const user = await getUserInServer(ctx);
      const redirect = authCheck(user, authRole);
      if (redirect) {
        ctx.res.writeHead(302, { Location: redirect });
        ctx.res.end();
      }
    }
    return {};
  };
}

export { AuthProvider, useAuth };
