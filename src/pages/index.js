import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { signIn } from 'next-auth/react'
import Loginbtn from './components/loginBtn'
import Navbar from './components/navBar'
import { getSession } from 'next-auth/react'
import { executeQuery } from "../../lib/db"

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
          redirect: {
              destination: '/',
              permanent: false,
          },
      }
  }
}

export default function Home({ result }) {

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar initials={result[0].initials} />
      <div className={styles.main}>
        <div className={styles.yourShifts}>
          <div className={styles.shiftsTitle}>
            <h1>Upcoming shifts</h1>
            <h3>Show all (10)</h3>
          </div>
          <hr />
          <div className={styles.shifts}>
            <div className={styles.shift}>
              <div className={styles.shiftDate}>
                <h3>12/04/23</h3>
                <h3>Wednesday</h3>
              </div>
              <div className={styles.shiftInfo}>
                <h3>08:00 - 16:00</h3>
                <h3>Cashier</h3>
              </div>
            </div>
          </div>
          <div className={styles.shifts}>
            <div className={styles.shift}>
              <div className={styles.shiftDate}>
                <h3>13/04/23</h3>
                <h3>Thursday</h3>
              </div>
              <div className={styles.shiftInfo}>
                <h3>08:00 - 16:00</h3>
                <h3>Cashier</h3>
              </div>
            </div>
          </div>
          <div className={styles.shifts}>
            <div className={styles.shift}>
              <div className={styles.shiftDate}>
                <h3>14/04/23</h3>
                <h3>Friday</h3>
              </div>
              <div className={styles.shiftInfo}>
                <h3>08:00 - 16:00</h3>
                <h3>Cashier</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
