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

        const departments = await executeQuery({
            query: 'SELECT * FROM departments',
            value: []
        })

        return {
            props: {
                result: result,
                departments: departments
            },
        }
    } else {
        return {
            props: {
                result: null,
                departments: null
            },
        }
    }
}

export default function Profile({ result, departments }) {

    // here we are getting the first and last initial of the user's name
    const nameParts = result[0].name.split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;

    const department = departments.find(department => department.department_id === result[0].department_id).department_name;

    return (
        <>
            <Head>
                <title>My Website - Profile</title>
                <meta name="description" content="Profile page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar user={result[0]} />
            <div className={styles.main}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {initials}
                    </div>
                    <div className={styles.info}>
                        <h1>{result[0].name}</h1>
                        <h2>Department: {department}</h2>
                        <h2>Age: {result[0].age}</h2>
                    </div>
                </div>
            </div>
        </>
      )
}