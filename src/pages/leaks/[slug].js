import React from 'react';
import LeakDetailsPage from '@/views/LeakDetailsPage';
import Head from 'next/head';
import { fetchDataFromIPFSCID } from '@/services/ipfs.service';

function Details({ leakData }) {
  return (
    <>
      <Head>
        <meta property="og:title" content={leakData?.title} />
        <meta property="og:image" content={leakData?.coverImage} />
      </Head>
      <div className="container">
        <LeakDetailsPage />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.query;

  const leakData = await fetchDataFromIPFSCID(slug);

  // Return the data as props
  return {
    props: {
      leakData,
    },
  };
}

export default Details;
