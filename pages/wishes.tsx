import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useQuery, useMutation } from '@apollo/client';
import { Layout, Container } from '../lib/components/Layout';
import WishEditor from '../lib/components/WishEditor';
import WishViewer from '../lib/components/WishViewer';
import Share from '../lib/components/Share';
import { serverAuth, useAuth } from '../lib/auth';
import * as myWishes from '../lib/queries/myWishes';
import * as addWishQuery from '../lib/queries/addWish';
import { User } from '../lib/Types';

const Page: NextPage = function Wish() {
  const user = useAuth('Authenticated');

  const { data, loading, error } = useQuery<myWishes.MyWishes, null>(myWishes.QUERY);

  const [addWish, { loading: addWishLoading, error: addwishError }] = useMutation<
    addWishQuery.Result,
    addWishQuery.Variables
  >(addWishQuery.QUERY, {
    update(cache, { data }) {
      if (data && data.addWish && data.addWish.data) {
        const addWishResult = data && data.addWish;
        const myWishesResult = cache.readQuery<myWishes.MyWishes, null>({
          query: myWishes.QUERY,
        });
        cache.writeQuery<myWishes.MyWishes, null>({
          query: myWishes.QUERY,
          data: {
            me: {
              ...(myWishesResult ? myWishesResult.me : {}),
              wishes: [
                ...(myWishesResult && myWishesResult.me.wishes ? myWishesResult.me.wishes : []),
                ...(addWishResult.data ? addWishResult.data : []),
              ],
            } as User,
          },
        });
      }
    },
  });

  return (
    <Layout>
      <Container>
        <Head>
          <title>Wish List App - Your Wishes</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Share />
          <h2 className="text-indigo-900 text-3xl mb-1 pt-4"> Add A Wish </h2>
          <WishEditor
            className="mb-16"
            submitText="Add Wish"
            onSubmit={(wish) => {
              addWish({ variables: { wish: { ...wish, userId: user?.id } } });
            }}
          />

          {data && data?.me?.wishes.length > 0 && (
            <>
              <h2 className="text-indigo-900 text-3xl mb-1 pt-4">Your Wishes</h2>
              {data.me.wishes.map((wish) => (
                <WishViewer key={wish.id} wish={wish} />
              ))}
            </>
          )}
        </main>
      </Container>
    </Layout>
  );
};

Page.getInitialProps = serverAuth('Authenticated');

export default Page;
