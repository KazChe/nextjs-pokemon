/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Details.module.css'
import { useRouter } from 'next/router'

export default function Details() {
    const { query: { id } } = useRouter();
    const [pokemon, setPokemon] = useState(null)

    useEffect(() => {
        async function getPokemon() {
            const resp = await fetch(`https://jherr-pokemon.s3.us-west-1.amazonaws.com/pokemon/${id}.json`)
            setPokemon(await resp.json())
        }
        if (id) getPokemon();
    }, [id])
    /*
    Nextjs always tries to be SSR'ing this page by default. 
    To cicumvent that and wait till we're on the client we can design the logic such that We're working around that to tell it not until we have fetched the data on client-side from the S3 bucket.
    */
    if (!pokemon) return null

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
