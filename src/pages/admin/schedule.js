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

        return {
            props: {
                users: users,
                shiftName: shiftName,
            },
        }
    } else {
        return {
            props: {
                users: null,
                shiftName: null,
          },
        }
    }
}

export default function Schedule({ users, shiftName }) {

    let schedule = [];
	const [userSchedule, setUserSchedule] = useState([]);
    //Database: username, shift_id: shift, work_day: day
	const retriveSchedule = async () => {
		const schedulefetch = await fetch('/api/updateSchedule', {
			method: 'GET',
			headers: {'Content-Type': 'application/json'}
		});

		if (!schedulefetch.ok) {alert("Error fetching schedule data")};

		schedule = await schedulefetch.json();
		console.log(schedule.schedule);
        let newUserSchedule = [];
        Object.keys(schedule.schedule).forEach((day) => {
            const dayShifts = schedule.schedule[day];
            Object.keys(schedule.schedule[day]).forEach((shift) => {
                const users = dayShifts[shift];
                users.forEach((user) => {
                    newUserSchedule.push({ username: user, work_day: day, shift_id: shift});
                });
            });
        });
        console.log(newUserSchedule);
        
        setUserSchedule(newUserSchedule);

        console.log(userSchedule);

    };
    
    const truncateTable = async () => {
        const truncate = await fetch('/api/truncateSchedule', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
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

    if (!unAuthorized) {
        return (
            <>  
                <Head>
                    <title>My Website - Manage Employees</title>
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
                    <button onClick={retriveSchedule}>Click me</button>
                    <button onClick={truncateTable}>Truncate din mor</button>
                    {/* <div className={styles.calendar}> 
                        <WeekGridTable schedule={userSchedule} shiftName={shiftName} users={users}/>
                    </div> */}
                </div>
            </>
        )
    } else {
        return <>unAuthorized</>;
    }
}