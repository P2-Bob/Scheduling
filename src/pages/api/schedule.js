import { executeQuery } from "../../../lib/db";
import generateSchedule from "../algorithmscheduleimprover";

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
            console.log(d.toISOString().substring(0,10));
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
                if (shift === "17-22")shift_id = 3;
                users.forEach((user) => {
                    userSchedule.push({ username: user, work_day: day, shift_id: shift_id, date: date.toISOString().substring(0,10)});
                });
            });
        });
        console.log(userSchedule);
        userSchedule.forEach(async (user) => {
            await executeQuery({
                query: 'INSERT INTO schedule (username, shift_id, work_day, date) VALUES (?, ?, ?, ?)',
                value: [user.username, user.shift_id, user.work_day, user.date]
            });
        });
        
        res.status(200).json({ schedule, fitnessValue, count, userSchedule, date});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}