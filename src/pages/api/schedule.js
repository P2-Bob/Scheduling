import { executeQuery } from "../../../lib/db";
import generateSchedule from "../algorithmscheduleimprover";

export default async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

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
        const { weekNumber } = req.body;
        const { schedule, fitnessValue, count } = await generateSchedule(employees, youthEmployees, preference);
        let userSchedule = [];
        let shift_id = null;
        
        Object.keys(schedule).forEach((day) => {
            const dayShifts = schedule[day];
            Object.keys(schedule[day]).forEach((shift) => {
                const users = dayShifts[shift];
                if (shift === "6-14")shift_id = 1;
                if (shift === "14-22")shift_id = 2;
                if (shift === "17-22")shift_id = 3;
                users.forEach((user) => {
                    userSchedule.push({ username: user, work_day: day, shift_id: shift_id, weekNumber: weekNumber});
                });
            });
        });
        console.log(userSchedule);
        userSchedule.forEach(async (user) => {
            await executeQuery({
                query: 'INSERT INTO schedule (username, shift_id, work_day, weekNumber) VALUES (?, ?, ?, ?)',
                value: [user.username, user.shift_id, user.work_day, weekNumber]
            });
        });
        
        res.status(200).json({ schedule, fitnessValue, count, userSchedule, weekNumber});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}