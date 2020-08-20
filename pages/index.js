import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layout, Container } from '../lib/components/Layout';
import { useCurrentUser } from '../lib/components/AuthProvider';

export default function Home() {
  const user = useCurrentUser();

  return (
    <Layout floatHeader>
      <Head>
        <title>Wish List App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="h-screen bg-home-hero bg-cover bg-center flex flex-col justify-center">
          <Container className="flex flex-col justify-center items-center">
            <div className="bg-gray-100 bg-opacity-50 px-4 py-4 md:px-8 md:py-6 flex flex-col justify-center items-center rounded">
              <h2 className="text-3xl md:text-6xl text-indigo-800 uppercase text-black">Wish List App</h2>
              <p className="text-1xl md:text-3xl text-indigo-800 md:text-indigo-700 text-bold mb-4">
                Create wish list, Share with friends, Watch it happen
              </p>
              <Link href={user ? '/wishes' : '/register'}>
                <a className="btn-yellow btn-large">Create Your Wish List</a>
              </Link>
            </div>
            <span className="absolute right-0 bottom-0 p-1 text-white text-xs font-hairline">
              Photo by
              <a href="https://unsplash.com/@customerbox?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                Customerbox
              </a>{' '}
              on{' '}
              <a href="https://unsplash.com/s/photos/wish?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                Unsplash
              </a>
            </span>
          </Container>
        </section>
      </main>

      <footer></footer>
    </Layout>
  );
}
