import '../styles/index.css';
import React from 'react';
import App, { AppProps, AppContext } from 'next/app';
import { ApolloProvider, ApolloClient, ApolloCache, InMemoryCache } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import withApollo from '../lib/withApollo';
import { AuthProvider } from '../lib/components/AuthProvider';

type MyAppProps = AppProps & { apollo: ApolloClient<ApolloCache<InMemoryCache>> };

function MyApp({ Component, pageProps, apollo }: MyAppProps) {
  return (
    <ApolloProvider client={apollo}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default withApollo(MyApp as React.FunctionComponent<any>, { getDataFromTree });
