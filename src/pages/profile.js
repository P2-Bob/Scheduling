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

    // here we are getting the first and last initial of the user's name
    const nameParts = result[0].name.split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;

    return (
        <>
            <Head>
                <title>My Website - Profile</title>
                <meta name="description" content="Profile page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar name={result[0].name} />
            <div className={styles.main}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {initials}
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