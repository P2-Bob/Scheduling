import { getServerSession } from "next-auth";
import { executeQuery } from "../../../lib/db";


export default async function handler(req, res) {
    const session = await getServerSession(req, res);

    // check if user is an admin
    const result = await executeQuery({
        query: 'SELECT * FROM users WHERE username = $1', // MYSQL uses ? and Postgres uses $1
        value: [session.user.name]
    });

    if (result[0].role == "admin") {

        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        const { username, password, name, role, age, department_id } = req.body;

        try {
            await executeQuery({
                query: 'INSERT INTO users (username, password, name, role, age, department_id) VALUES ($1, $2, $3, $4, $5, $6)', // MYSQL uses ? and Postgres uses $1, $2 etc
                value: [username, password, name, role, age, department_id]
            });
            res.status(200).json({ result: "User created" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }

}