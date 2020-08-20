import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useApolloClient, gql, useMutation } from '@apollo/client';
import { Layout, Container } from '../lib/components/Layout';
import { serverAuth, useAuth } from '../lib/auth';
import * as meQuery from '../lib/queries/me';
import * as updateUserQuery from '../lib/queries/updateUser';
import ProfileForm from '../lib/components/ProfileForm';
import { User } from '../lib/Types';
import { useRouter } from 'next/router';

const Page: NextPage = function Profile() {
  const client = useApolloClient();
  const router = useRouter();
  const user = useAuth('Authenticated');

  const [updateUser, { loading, error }] = useMutation<updateUserQuery.Result, updateUserQuery.Variables>(
    updateUserQuery.QUERY,
    {
      update(cache, { data }) {
        if (data && data.updateUser) {
          const result = data && data.updateUser;
          const user: User | undefined = result && result.data;
          if (user) {
            const meResult = cache.readQuery<meQuery.Me, null>({
              query: meQuery.QUERY,
            });
            cache.writeQuery<meQuery.Me, null>({
              query: meQuery.QUERY,
              data: {
                me: {
                  ...(meResult && meResult.me ? meResult.me : {}),
                  ...user,
                  //wishes: (myWishesResult && myWishesResult.me ? myWishesResult.me.wishes : [])
                } as User,
              },
            });
            router.push('/wishes');
          }
        }
      },
    },
  );

  const isProfileComplete: boolean = user?.fullName && user.urlShortName ? true : false;

  return (
    <Layout>
      <Container>
        <Head>
          <title>Wish List App - Profile</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-indigo-700 font-bold text-1xl uppercase mb-8">Your Profile</h1>
          {!isProfileComplete && (
            <div className={'alert-warning'}>
              Please complete your profile. For sharing your wish list I need your name and a short name for your link.
            </div>
          )}
          <ProfileForm
            defaultValues={{
              fullName: user?.fullName,
              urlShortName: user?.urlShortName,
            }}
            onSubmit={(values) => {
              if (user) {
                updateUser({ variables: { user: values, userId: user.id } });
              }
            }}
          />
        </main>
      </Container>
    </Layout>
  );
};

Page.getInitialProps = serverAuth('Authenticated');

export default Page;
