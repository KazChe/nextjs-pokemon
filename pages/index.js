/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

/* 1 
  We're going to start here by adding an async function
  and use getServerSideProps that runs only on server-side at request time
  the page will be pre-rendered with the returned 'props'
  See more: https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
*/
export async function getServerSideProps(context) {
  const resp = await fetch("https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json")

  return {
    props: {
      pokemon: await resp.json()
    }
  }
}

/* 2
 So, now pass pokemon returnded from server-side
 and get rid of all the client-side code
*/
export default function Home({ pokemon }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokemon List</title>
      </Head>
      <div className={styles.grid}>
        {pokemon.map((pokemon) => (
          <div className={styles.card} key={pokemon.id}>
            <Link href={`/pokemon/${pokemon.id}`}>
              <a>
                <img
                  src={`https://jherr-pokemon.s3.us-west-1.amazonaws.com/${pokemon.image}`}
                  alt={pokemon.name}
                />
                <h3>{pokemon.name}</h3>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
