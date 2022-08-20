/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Details.module.css'
import { useRouter } from 'next/router'

// SSG - Static Site Generation
export async function getStaticPaths() {
    const resp = await fetch("https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json")
    const pokemon = await resp.json()

    return {
        paths: pokemon.map((pokemon) => ({
            params: { id: pokemon.id.toString() }

        })),
        fallback: false
    }
}
export async function getStaticProps({ params }) {
    const resp = await fetch(`https://jherr-pokemon.s3.us-west-1.amazonaws.com/pokemon/${params.id}.json`)

    return {
        props: {
            pokemon: await resp.json()
        },
        revalidate: 30 //in seconds - for SSG, in order to get data change we need to set an interval to check for any data change. You have to have someting  like having an S3 mounted on your deployable
    }
}

/*
Nextjs always tries to be SSR'ing this page by default. 
To cicumvent that and wait till we're on the client we can design the logic such that We're working around that to tell it not until we have fetched the data on client-side from the S3 bucket.
*/

export default function Details({ pokemon }) {
    return (
        <div>
            <Head>
                <title>{pokemon.name}</title>
            </Head>
            <Link href="/">
                <a>GoHome</a>
            </Link>
            <div className='styles.layout'>
                <img className={styles.picture} src={`https://jherr-pokemon.s3.us-west-1.amazonaws.com/${pokemon.image}`} alt='Eat Shit' />
                <div className={styles.name}>{pokemon.name}</div>
                <div className={styles.type}>{pokemon.type.join(', ')}</div>
                <table>
                    <thead className={styles.header}>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pokemon.stats.map(({ name, value }) => (
                            <tr key={name}>
                                <td className={styles.attribute}>{name}</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
