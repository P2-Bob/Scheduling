import { executeQuery } from "../../../lib/db";
import generateSchedule from "../algorithm";

export default async (req, res) => {
    try {

        const employees = await executeQuery({
            query: 'SELECT username FROM users WHERE age >= 18',
            value: []
        });

        const youthEmployees = await executeQuery({
            query: 'SELECT username FROM users WHERE age < 18',
            value: []
        });

        const preference = await executeQuery({
            query: 'SELECT * FROM preference',
            value: []
        });

        const { schedule, fitnessValue, count } = await generateSchedule(employees, youthEmployees, preference);
        res.status(200).json({ schedule, fitnessValue, count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}