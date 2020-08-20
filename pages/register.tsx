import React from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout, Container } from '../lib/components/Layout';
import RegisterForm from '../lib/components/RegisterForm';
import * as registerQuery from '../lib/queries/register';
import { serverAuth, useAuth } from '../lib/auth';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import * as meQuery from '../lib/queries/me';
import checkGraphQLError from '../lib/checkGraphQLError';

const Page: NextPage = function Register() {
  useAuth('NotAuthenticated');
  const router = useRouter();
  const client = useApolloClient();

  const [register, { loading, error }] = useMutation<registerQuery.Register, registerQuery.Variables>(
    registerQuery.QUERY,
    {
      onCompleted: ({ register }) => {
        cookie.set('token', register.token, { expires: 365 });
        client.writeQuery<meQuery.Me, null>({ query: meQuery.QUERY, data: { me: register.user } });
        router.replace('/profile');
      },
    },
  );

  return (
    <Layout>
      <Container>
        <Head>
          <title>Wish List App - Register</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-indigo-700 font-bold text-2xl uppercase mb-8">Wish List App</h1>
          {checkGraphQLError(error, 'BAD_USER_INPUT') && (
            <div className="alert-danger">Email address already taken.</div>
          )}
          <RegisterForm
            onSubmit={(values) => {
              register({ variables: { email: values.email, password: values.password } });
            }}
          />
          <Link href="/login">
            <a>Login</a>
          </Link>
        </main>
      </Container>
    </Layout>
  );
};

Page.getInitialProps = serverAuth('NotAuthenticated');

export default Page;
