import { getServerSession } from "next-auth";
import { executeQuery } from "../../../lib/db";


export default async function handler(req, res) {
    const session = await getServerSession(req, res);

    // check if user is an admin
    const result = await executeQuery({
        query: 'SELECT * FROM users WHERE username = $1', // MYSQL uses ? and Postgres uses $1
        value: [session.user.name]
    });

        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        const { userPreferences } = req.body;

        try {
            const result = await executeQuery({
                query: 'UPDATE preference SET monday = $1, tuesday = $2, wednesday = $3, thursday = $4, friday = $5, saturday = $6, sunday = $7 WHERE case_id = $8', // MYSQL uses ? and Postgres uses $1, $2 etc
                value: [
                    userPreferences[0].monday, userPreferences[0].tuesday,
                    userPreferences[0].wednesday, userPreferences[0].thursday,
                    userPreferences[0].friday, userPreferences[0].saturday,
                    userPreferences[0].sunday, userPreferences[0].case_id
                ]
            });
            res.status(200).json({ result: "Preferences Succesfully Updated" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

}