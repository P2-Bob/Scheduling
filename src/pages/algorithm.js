const employees = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Fred', 'Grace', 'Helen', 'Irene', 'Jack', 'Kelly', 'Larry'];
const youthemployees = ['Mia', 'Nia', 'Oia', 'Pia', 'Qia', 'Ria', 'Sia', 'Tia', 'Uia', 'Via', 'Wia', 'Xia', 'Yia', 'Zia'];
const shifts = ["6-14", '14-22'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let amountOfWorkers = 2;

function randomEmployee(amountOfWorkers, worker) {
    let pickEmployee = []

    for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {

        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];
        
        let sameEmployeeCheckInterval = 1;
        while (pickEmployee[amountOfWorkersCounter] === pickEmployee[amountOfWorkersCounter - sameEmployeeCheckInterval]) {
            pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];
            sameEmployeeCheckInterval++;
        }
    }

    return pickEmployee
}

const randomSchedule = () => {
    const schedule = {};

    for (let daysLength = 0; daysLength < days.length; daysLength++) {
        const day = days[daysLength];
        schedule[day] = {};

        for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
            const shift = shifts[shiftsLength];
            schedule[day][shift] = randomEmployee(amountOfWorkers,employees);

        }    
    }
    
    return schedule;
}

console.log(randomSchedule());

