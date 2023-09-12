import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {executeQuery} from "../../../../lib/db"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            username: { label: "Username", type: "text", placeholder: "username" },
            password: { label: "Password", type: "password", placeholder: "password" }
        },
        async authorize(credentials, req) {
            // You need to provide your own logic here that takes the credentials
            // submitted and returns either a object representing a user or value
            // that is false/null if the credentials are invalid.
            // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
            // You can also use the `req` object to obtain additional parameters
            // (i.e., the request IP address)
            console.log(credentials)
            console.log(credentials.username, credentials.password)
            try {
                const result = await executeQuery({
                    query: 'SELECT * FROM users WHERE username = $1 AND password = $2', // MYSQL uses ? and Postgres uses $1
                    value: [credentials.username, credentials.password]
                });
                console.log("auth", result)
                if (result.length > 0) {
                    const user = { id: result[0].employee_id, name: result[0].username }
                    return user;
                }
                return null;
            } catch (error) {
                console.log(error)
                return null;
            }
        }
    })
    ],
}

export default NextAuth(authOptions)