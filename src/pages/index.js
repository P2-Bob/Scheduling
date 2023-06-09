import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { signIn } from 'next-auth/react'
import Loginbtn from './components/loginBtn'
import Navbar from './components/navBar'
import { getSession } from 'next-auth/react'
import { executeQuery } from "../../lib/db"
import DayGridTable from './components/dayGridTable'
import { useMediaQuery } from '../../lib/mediaQuery'


export async function getServerSideProps(ctx) {

  const session = await getSession(ctx);

  if (session) {
      // Fetch data from database
		const result = await executeQuery({
			query: 'SELECT * FROM users WHERE username = ?',
			value: [session.user.name]
		})

      // Pass data to the page via props

		const userSchedule = await executeQuery({
			query: 'SELECT * FROM schedule WHERE username = ?',
			value: [session.user.name]
		}) 

		const shiftName = await executeQuery({
			query: 'SELECT * FROM shifts',
			value: []
		})

		return {
			props: {
				result: result,
				userSchedule: userSchedule,
				shiftName: shiftName,
			},
		}
	} else {
		return {
			props: {
				result: null,
				userSchedule: null,
				shiftName: null,
			},
		}
	}
}

export default function Home({ result, userSchedule, shiftName }) {

	
	return (
		<>
			<Head>
				<title>Market Scheduling</title>
				<meta name="description" content="Home Page" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar user={result[0]} />
			<div className={styles.main}>
				<h1>Your Upcoming Shifts</h1>
				{!useMediaQuery(768) ?
					(
						<div className={styles.calendar}>
						<DayGridTable schedule={userSchedule} shiftName={shiftName} />
						</div>
					) : (
						<div className={styles.shiftList}>
							{userSchedule.map((shift) => {
								const shift1 = shiftName.filter((shifts) => shifts.shift_id === shift.shift_id);
								const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
								const date = new Date(shift.date);
								const weekday = weekdays[date.getDay()];
								const shiftTime = shift1[0].shift_time.replace("-", ":00 - ") + ":00";
								return (
									<div className={styles.shift} key={shift.schedule_id}>
										<div className={styles.dateContainer}>
											<h3>{weekday}</h3>
											<h3>{date.toLocaleDateString()}</h3>
										</div>
										<h2>{shiftTime}</h2>
									</div>
								)
							})}
						</div>
					)
				}
			</div>
		</>
	)
}
