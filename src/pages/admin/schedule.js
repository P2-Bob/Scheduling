import Navbar from "../components/navBar";
import Head from 'next/head';
import { useSession, getSession } from 'next-auth/react';
import { executeQuery } from "../../../lib/db";
import styles from '../../styles/AdminSchedule.module.css';
import WeekGridTable from "../components/weekGridTable";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'

export async function getServerSideProps(ctx) {

    const session = await getSession(ctx);

    if (session) {
        // Fetch data from database
        const users = await executeQuery({
            query: 'SELECT * FROM users',
            value: []
        })

		const shiftName = await executeQuery({
			query: 'SELECT * FROM shifts',
			value: []
        })
        
        const schedule = await executeQuery({
            query: 'SELECT * FROM schedule',
            value: []
        })

        return {
            props: {
                users: users,
                shiftName: shiftName,
                currentSchedule: schedule,
            },
        }
    } else {
        return {
            props: {
                users: null,
                shiftName: null,
                currentSchedule: null,
          },
        }
    }
}

export default function Schedule({ users, shiftName, currentSchedule }) {

    let schedule = [];
    const [userSchedule, setUserSchedule] = useState([]);
    const [date, setDate] = useState(Date());

	const retriveSchedule = async () => {
		const schedulefetch = await fetch('/api/updateSchedule', {
			method: 'GET',
			headers: {'Content-Type': 'application/json'}
		});

		if (!schedulefetch.ok) {alert("Error fetching schedule data")};

		schedule = await schedulefetch.json();
        
        setUserSchedule(schedule.userSchedule);
        setDate(new Date(schedule.date));

        /* console.log("Date", schedule.date);
        const currentDate = new Date(schedule.date);
        console.log(currentDate) */

    };
    
    const truncateTable = async () => {
        const truncate = await fetch('/api/truncateSchedule', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        setUserSchedule([]);
    }

    const { data: session } = useSession();
    let unAuthorized = true;
    let foundUser = null;
    if (session) {

        foundUser = users.find(user => user.username === session.user.name);

        if (foundUser.role != 'admin') {
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

    useEffect(() => {
        if (currentSchedule.length > 0) {
            setUserSchedule(currentSchedule);
            setDate(new Date(currentSchedule[0].date));
        }
    }, []);

    if (!unAuthorized) {
        return (
            <>  
                <Head>
                    <title>Scheduling - Manage Employees</title>
                    <meta name="description" content="Admin page" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar user={foundUser} />
                <div className={styles.main}>
                    <div className={styles.headerInfo}>
                        <h1>Schedule Section</h1>
                        <p>Here you can manage the schedule for the employees</p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.createButton} onClick={retriveSchedule} disabled={userSchedule.length > 0}>Create Schedule</button>
                        <button className={styles.deleteButton} onClick={truncateTable}>Delete Schedule</button>
                    </div>
                    <div className={styles.calendar}>
                        {userSchedule.length > 0 ? (<WeekGridTable schedule={userSchedule} shiftName={shiftName} users={users} startDate={date}/>) : ""}
                    </div>
                </div>
            </>
        )
    } else {
        return <>unAuthorized</>;
    }
}