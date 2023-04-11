import { getServerSession } from "next-auth";
import { executeQuery } from "../../../lib/db";


export default async function handler(req, res) {
    const session = await getServerSession(req, res);

    // check if user is an admin
    const result = await executeQuery({
        query: 'SELECT * FROM users WHERE username = ?',
        value: [session.user.name]
    });

    if (result[0].role == "admin") {

        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        const { username, password, name, initials, role, age, department } = req.body;

        try {
            const result = await executeQuery({
                query: 'INSERT INTO users (username, password, name, initials, role, age, department) VALUES (?, ?, ?, ?, ?, ?, ?)',
                value: [username, password, name, initials, role, age, department]
            });
            res.status(200).json({ result: "User created" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }

}