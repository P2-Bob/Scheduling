import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Navbar from './components/navBar'
import { getSession, useSession } from 'next-auth/react'
import { executeQuery } from "../../lib/db"
import WeekGridTable from './components/weekGridTable'

export async function getServerSideProps(ctx) {

  	const session = await getSession(ctx);

  	if (session) {
		const userSchedule = await executeQuery({
			query: 'SELECT * FROM schedule',
			value: []
		}) 

		const shiftName = await executeQuery({
			query: 'SELECT * FROM shifts',
			value: []
		})

		const users = await executeQuery({
			query: 'SELECT * FROM users',
			value: []
		})
	  
		return {
			props: {
				userSchedule: userSchedule,
				shiftName: shiftName,
				users: users,
			},
		}
	} else {
		return {
			props: {
				userSchedule: null,
				shiftName: null,
				users: null,
			},
		}
	}
}

export default function Schedule({ userSchedule, shiftName, users }) {

	const { data: session } = useSession();
	let foundUser = null;
	//console.log(user);
    if (session) {
        foundUser = users.find(user => user.username === session.user.name);
    }
	
	
	return (
		<>
		<Head>
			<title>Scheduling - schedule</title>
			<meta name="description" content="Schedule page" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<Navbar user={foundUser} />
		<div className={styles.main}>
			<h1>Your Upcoming Shifts</h1>
			<div className={styles.calendar}>
			<WeekGridTable schedule={userSchedule} shiftName={shiftName} users={users} startDate={new Date()} />
			</div>
		</div> 
		</>
	)
}
