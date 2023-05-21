import Head from 'next/head'
import Image from 'next/image'
import Navbar from './components/navBar'
import styles from '@/styles/Profile.module.css'
import { executeQuery } from '../../lib/db'
import { getSession } from 'next-auth/react'
import { MdWorkHistory, MdWorkOff, MdWork } from 'react-icons/md'
import { useState } from 'react'
import { useMediaQuery } from '../../lib/mediaQuery'

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

        const mySchedule = await executeQuery({
            query: 'SELECT * FROM schedule WHERE username = ?',
            value: [session.user.name]
        })

        const preferences = await executeQuery({
            query: 'SELECT * FROM preference WHERE username = ?',
            value: [session.user.name]
        })

        return {
            props: {
                result: result,
                departments: departments,
                mySchedule: mySchedule,
                myPreferences: preferences
            },
        }
    } else {
        return {
            props: {
                result: null,
                departments: null,
                mySchedule: null,
                myPreferences: null
            },
        }
    }
}

export default function Profile({ result, departments, mySchedule, myPreferences }) {

    // here we are getting the first and last initial of the user's name
    const nameParts = result[0].name.split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    const initials = firstInitial + lastInitial;

    const department = departments.find(department => department.department_id === result[0].department_id).department_name;

    let workTime = 0;
    for (const shift in mySchedule) {
        if (mySchedule[shift].shift_id === 1 || mySchedule[shift].shift_id === 2) {
            workTime += 8;
        } else {
            workTime += 5;
        }
    }

    console.log(myPreferences[0]["monday"])

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    const [editingPreference, setEditingPreference] = useState(false);
    const [userPreferences, setUserPreferences] = useState(myPreferences);

    const handlePreferenceChange = (caseId, day, newValue) => {
        setUserPreferences(prevState => {
            return prevState.map(preference => {
                if (preference.case_id === caseId) {
                    return {...preference, [day]: Number(newValue)}
                }
                return preference;
            })
        })
    }

    const handlePreferenceSubmit = async (e) => {
        e.preventDefault();
        console.log(userPreferences);
        setEditingPreference(!editingPreference);

        const result = await fetch('/api/updatePreference', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userPreferences
            })
        });

        if (!result.ok) {
            alert('Something went wrong!');
            return;
        }

        alert('Preferences updated successfully!');
    }

    return (
        <>
            <Head>
                <title>Market Scheduling - Profile</title>
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
                        <h2>Hours Worked: {workTime}</h2>
                    </div>
                    <div className={styles.preferences}>
                        <h1>Preferences</h1>
                        <p>Below you can see your <span style={{ color: "green" }}>prefered</span> and <span style={{ color: "red"}}>not prefered</span> work days</p>
                        {!editingPreference ? (
                            useMediaQuery(768) ? (
                                <div className={styles.preferenceContainerM}>
                                    <div className={styles.preferenceList}>
                                        {userPreferences.map((preference) => (
                                            days.map((day) => (
                                                <div className={`
                                                ${styles.preferenceItem} 
                                                ${preference[day] === 0 ? styles.dontCareM :
                                                    preference[day] === 1 ? styles.workM :
                                                    styles.dontWorkM
                                                }
                                                `} key={day}>
                                                    <div className={styles.day}>{day[0].toUpperCase() + day[1] + day[2]}</div>
                                                    <div className={styles.icon}>
                                                        {preference[day] === 0 ? <MdWork/> :
                                                        preference[day] === 1 ? <MdWorkHistory/> :
                                                        <MdWorkOff/>}
                                                    </div>
                                                </div>
                                            ))
                                        ))}
                                    </div>
                                    <button className={styles.editPreferences} onClick={() => setEditingPreference(!editingPreference)}>Edit Preferences</button>
                                </div>
                                
                            ) : (
                                <div className={styles.preferenceTable}>
                                    <table>
                                        <thead>
                                            <tr className={styles.weekDays}>
                                                {days.map((day) => (
                                                    <th className={styles.weekDays} key={day}>{day[0].toUpperCase() + day[1] + day[2]}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userPreferences.map((preference) => (
                                                <tr key={preference.case_id}>
                                                    {days.map((day) => (
                                                        <td key={day} className={
                                                            preference[day] === 0 ? styles.dontCare :
                                                            preference[day] === 1 ? styles.work :
                                                            styles.dontWork
                                                        }>{preference[day] === 1 ? <MdWorkHistory/> : preference[day] === 2 ? <MdWorkOff/> : <MdWork/>}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button className={styles.editPreferences} onClick={() => setEditingPreference(!editingPreference)}>Edit Preferences</button>
                                </div>
                            )
                        ) : (
                            useMediaQuery(768) ? (
                                <div className={styles.preferenceContainerM}>
                                    <form>
                                        <div className={styles.preferenceList}>
                                            {userPreferences.map((preference) => (
                                                days.map((day) => (
                                                    <div className={styles.preferenceItemS} key={day}>
                                                        <div className={styles.day}>{day[0].toUpperCase() + day[1] + day[2]}</div>
                                                        <select 
                                                            className={`
                                                                ${styles.preferenceSelect} 
                                                                ${preference[day] === 0 ? styles.dontCareM :
                                                                preference[day] === 1 ? styles.workM :
                                                                styles.dontWorkM
                                                            }`}
                                                            value={preference[day]} 
                                                            onChange={(e) => handlePreferenceChange(preference.case_id, day, e.target.value)}
                                                        >
                                                            <option value={0}>Don't Care</option>
                                                            <option value={1}>Work</option>
                                                            <option value={2}>Don't Work</option>
                                                        </select>
                                                    </div>
                                                ))
                                            ))}
                                        </div>
                                        <div className={styles.preferenceButtons}>
                                            <button className={styles.editPreferences} type="button" onClick={() => setEditingPreference(!editingPreference)}>Back</button>
                                            <button className={styles.savePreferences} type="submit" onClick={handlePreferenceSubmit}>Save</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className={styles.preferenceTable}>
                                    <form>
                                        <table>
                                            <thead>
                                                <tr className={styles.weekDays}>
                                                    {days.map((day) => (
                                                        <th className={styles.weekDays} key={day}>{day[0].toUpperCase() + day[1] + day[2]}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userPreferences.map((preference) => (
                                                    <tr key={preference.case_id}>
                                                        {days.map((day) => (
                                                            <td key={day}>
                                                                <select 
                                                                    className={`${styles.preferenceSelect} ${preference[day] === 0 ? styles.dontCare :
                                                                    preference[day] === 1 ? styles.work :
                                                                    styles.dontWork}`}
                                                                    value={preference[day]} 
                                                                    onChange={(e) => handlePreferenceChange(preference.case_id, day, e.target.value)}
                                                                >
                                                                    <option value={0}>Don't Care</option>
                                                                    <option value={1}>Work</option>
                                                                    <option value={2}>Don't Work</option>
                                                                </select>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className={styles.preferenceButtons}>
                                            <button className={styles.editPreferences} type="button" onClick={() => setEditingPreference(!editingPreference)}>Back</button>
                                            <button className={styles.savePreferences} type="submit" onClick={handlePreferenceSubmit}>Save</button>
                                        </div>    
                                    </form>                        
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
      )
}