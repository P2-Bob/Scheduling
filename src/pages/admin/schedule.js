import Navbar from "../components/navBar";
import Head from 'next/head';
import { useSession, getSession } from 'next-auth/react';
import { executeQuery } from "../../../lib/db";

export async function getServerSideProps(ctx) {

    const session = await getSession(ctx);

    if (session) {
        // Fetch data from database
        const users = await executeQuery({
            query: 'SELECT * FROM users',
            value: []
        })

        return {
            props: {
                users: users,
            },
        }
    } else {
        return {
            props: {
                users: null,
          },
        }
    }
}

export default function Schedule({ users }) {
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

    return (
        <>  
            <Head>
                <title>My Website - Manage Employees</title>
                <meta name="description" content="Admin page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar name={foundUser.name} />
            <h1>Schedule</h1>
            <button onClick={() => console.log(users)}>Click me</button>
        </>
    )
}