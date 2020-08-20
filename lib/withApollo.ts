import 'isomorphic-unfetch';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import withApollo from 'next-with-apollo';
import nookies from 'nookies';
import jsCookie from 'js-cookie';

export default withApollo(({ initialState, ctx }) => {
  let token = null;

  if (ctx && ctx.req) {
    const cookies = nookies.get(ctx);
    token = cookies.token;
  } else if (!ctx) {
    token = jsCookie.get('token');
  }

  return new ApolloClient({
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
      ...(token
        ? {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        : {}),
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
});
