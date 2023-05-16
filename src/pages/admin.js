import Head from 'next/head'
import Image from 'next/image'
import Navbar from './components/navBar'
import styles from '@/styles/Admin.module.css'
import { executeQuery } from '../../lib/db'
import { getSession } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Link from "next/link";

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

export default function Admin({ result }) {

    let schedule = [];
	let userSchedule = [];

	const retriveSchedule = async () => {
		const schedulefetch = await fetch('/api/schedule', {
			method: 'GET',
			headers: {'Content-Type': 'application/json'}
		});

		if (!schedulefetch.ok) {alert("Error fetching schedule data")};

		schedule = await schedulefetch.json();
		console.log(schedule.schedule);

		for (const day in schedule.schedule){
			console.log(day)
			for (const shift in schedule.schedule[day]){
				for (const employeeName in schedule.schedule[day][shift]) {
					if (schedule.schedule[day][shift][employeeName] == result[0].username){
						userSchedule.push({ day: day, shift: shift });
					}
				}
			}
		}
		console.log(userSchedule); 
	};
	

    const { data: session } = useSession();
    let unAuthorized = true;
    if (session) {
        if (result[0].role != 'admin') {
            unAuthorized = true;
        } else {
            unAuthorized = false;
        }
    }

    const router = useRouter();
    const { status: sessionStatus } = useSession();
    const loading = sessionStatus === 'loading';

    useEffect(() => {
        // check if the session is loading or the router is not ready
        if (loading || !router.isReady) return;

        // if the user is not authorized, redirect to the front page
        if (unAuthorized) {
            console.log('not authorized');
            router.push({
              pathname: '/',
            });
          }

    }, [loading, unAuthorized, sessionStatus, router]);

    if (loading) {
        return <>Loading app...</>;
    }

    if (!unAuthorized) {
        return (
            <>
                <Head>
                    <title>Market Scheduling - Admin</title>
                    <meta name="description" content="Admin page" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar user={result[0]} />
                <div className={styles.main}>
                    <h1>Administration Panel</h1>
                    <p>Welcome to the admin panel, what do you wanna do?</p>
                    <div className={styles.container}>
                        <div className={styles.buttonContainer}>
                            <Link href="/admin/employees" className={styles.button}>Manage Employees</Link>
                            <p>Manage employees, add new employees, remove employees and edit employees.</p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Link href="/admin/schedule" className={styles.button}>Manage Work Schedule</Link>
                            <p>Manage work schedule, add new work schedule, remove work schedule and edit work schedule.</p>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return <>unAuthorized</>;
    }
}