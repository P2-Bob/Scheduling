import Head from 'next/head'
import Image from 'next/image'
import Navbar from './components/navBar'
import styles from '@/styles/Profile.module.css'
import { executeQuery } from '../../lib/db'
import { getSession } from 'next-auth/react'

export async function getServerSideProps(ctx) {

    const session = await getSession(ctx);

    if (session) {
        // Fetch data from database
        const result = await executeQuery({
            query: 'SELECT * FROM users WHERE username = ?',
            value: [session.user.name]
        })

        // Pass data to the page via props
        console.log(result)

        return {
            props: {
                result: result,
            },
        }
    } else {
        return {
          props: {
            result: null,
          },
        }
    }
}

export default function Profile({ result }) {
    return (
        <>
            <Head>
                <title>My Website - Admin</title>
                <meta name="description" content="Admin page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar initials={result[0].initials} name={result[0].name} />
            <div className={styles.main}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {result[0].initials}
                    </div>
                    <div className={styles.info}>
                        <h1>{result[0].name}</h1>
                        <h2>Department: {result[0].department}</h2>
                        <h2>Age: {result[0].age}</h2>
                    </div>
                </div>
            </div>
        </>
      )
}