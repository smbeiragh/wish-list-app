import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { Layout, Container } from '../../lib/components/Layout';
import WishViewer from '../../lib/components/WishViewer';
import { serverAuth, useAuth } from '../../lib/auth';
import * as getUserByUrl from '../../lib/queries/getUserByUrl';
import { useRouter } from 'next/router';

const Page: NextPage = function Profile() {
  const currentUser = useAuth('public');
  const router = useRouter();

  const { urlShortName } = router.query;

  const { data, loading, error } = useQuery<getUserByUrl.Result, getUserByUrl.Variables>(getUserByUrl.QUERY, {
    variables: {
      urlShortName: typeof urlShortName === 'string' ? urlShortName : null,
    },
  });

  const user = data?.getUserByUrl;

  return (
    <Layout>
      <Container>
        <Head>
          <title>{`Wish List App - ${user?.fullName}'s Wishes`}</title>
        </Head>
        <main>
          {user && user?.wishes.length > 0 && (
            <>
              <h2 className="text-indigo-900 text-3xl mb-1 pt-12">{`${user.fullName}'s Wishes`}</h2>
              <p className="text-indigo-900 text-base mb-4">{`${user.fullName}' thinks you're a caring person. So, are you?`}</p>
              {user.wishes.map((wish) => (
                <WishViewer key={wish.id} wish={wish} readOnly />
              ))}
            </>
          )}
        </main>
      </Container>
    </Layout>
  );
};

Page.getInitialProps = serverAuth('public');

export default Page;
