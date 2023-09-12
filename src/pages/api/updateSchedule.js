import { getServerSession } from "next-auth";
import { executeQuery } from "../../../lib/db";
import generateSchedule from "../algorithmscheduleimprover";

export default async function handler(req, res) {
    const session = await getServerSession(req, res);

    // check if user is an admin
    const result = await executeQuery({
        query: 'SELECT * FROM users WHERE username = $1', // MYSQL uses ? and Postgres uses $1
        value: [session.user.name]
    });

    if (result[0].role == "admin") {
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
            //console.log("look", employees, youthEmployees, preference);
            const { schedule, fitnessValue, count } = await generateSchedule(employees, youthEmployees, preference);
            console.log("Schedule", schedule);
            let userSchedule = [];
            let shift_id = null;
            
            console.log("Employees", employees,"YouthEmployees", youthEmployees);

            const nextMonday = () => {
                let d = new Date();
                let untilNextMonday = (1 + 7 - d.getDay()) % 7;
                if (untilNextMonday === 0) {
                    untilNextMonday = 7;
                }
                d.setDate(d.getDate() + untilNextMonday);
                return d;
            };
            let date = null;

            //d.toISOString().substring(0,10);
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            daysOfWeek.forEach((day, index) => {
                const dayShifts = schedule[day];

                if (index === 0) { // If it's the first day (Monday)
                    date = nextMonday();
                } else { // For every other day, just add 1 day to the previous date
                    date.setDate(date.getDate() + 1);
                }

                Object.keys(dayShifts).forEach((shift) => {
                    const users = dayShifts[shift];
                    if (shift === "6-14")shift_id = 1;
                    if (shift === "14-22")shift_id = 2;
                    if (shift === "17-22") shift_id = 3;
                    console.log("Type of users:", typeof users);
                    console.log("Value of users:", users);
                    users.forEach((user) => {
                        userSchedule.push({ username: user, work_day: day, shift_id: shift_id, date: date.toISOString().substring(0,10)});
                    });
                });
            });
            
            userSchedule.forEach(async (user) => {
                await executeQuery({
                    query: 'INSERT INTO schedule (username, shift_id, work_day, date) VALUES ($1, $2, $3, $4)', // MYSQL uses ? and Postgres uses $1, $2 etc
                    value: [user.username, user.shift_id, user.work_day, user.date]
                });
            });
            
            res.status(200).json({ schedule, fitnessValue, count, userSchedule, date});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
}