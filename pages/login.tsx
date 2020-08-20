import React from 'react';
import { useQuery, useMutation, gql, useApolloClient, ApolloError } from '@apollo/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout, Container } from '../lib/components/Layout';
import LoginForm from '../lib/components/LoginForm';
import { GET_USERS_QUERY, UsersList } from '../lib/queries/users';
import * as LoginQuery from '../lib/queries/login';
import { NextPageContextWithApollo, serverAuth, useAuth } from '../lib/auth';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import * as meQuery from '../lib/queries/me';
import checkGraphQLError from '../lib/checkGraphQLError';
import { useCurrentUser } from '../lib/components/AuthProvider';

const Page: NextPage = function Login() {
  // const {
  //   data,
  //   loading,
  //   error
  // } = useQuery<UsersList, null>(GET_USERS_QUERY);

  const user = useAuth('NotAuthenticated');
  const router = useRouter();
  const client = useApolloClient();

  const [login, { loading, error }] = useMutation<LoginQuery.Login, LoginQuery.Variables>(LoginQuery.QUERY, {
    update(cache, { data }) {
      if (data && data.login.user) {
        cache.writeQuery<meQuery.Me, null>({ query: meQuery.QUERY, data: { me: data.login.user } });
        cookie.set('token', data.login.token, { expires: 365 });
      }
    },
    onCompleted: ({ login }) => {
      const isProfileComplete: boolean = login.user?.fullName && login.user?.urlShortName ? true : false;
      console.log(isProfileComplete, login);
      router.replace(isProfileComplete ? '/wishes' : '/profile');
    },
  });

  return (
    <Layout>
      <Container>
        <Head>
          <title>Wish List App - Login</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-indigo-700 font-bold text-2xl uppercase mb-8">Wish List App</h1>
          {checkGraphQLError(error, 'BAD_USER_INPUT') && <div className="alert-danger">Invalid email or password.</div>}
          <LoginForm
            onSubmit={(values) => {
              login({ variables: { email: values.email, password: values.password } });
            }}
          />
          <Link href="/register">
            <a>Register</a>
          </Link>
        </main>
      </Container>
    </Layout>
  );
};

Page.getInitialProps = serverAuth('NotAuthenticated');

export default Page;
