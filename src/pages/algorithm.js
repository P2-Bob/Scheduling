const employees = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Fred', 'Grace', 'Helen', 'Irene', 'Jack', 'Kelly', 'Larry'];
const youthemployees = ['Mia', 'Nia', 'Oia', 'Pia', 'Qia', 'Ria', 'Sia', 'Tia', 'Uia', 'Via', 'Wia', 'Xia', 'Yia', 'Zia'];
const shifts = ["6-14", '14-22'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let amountOfWorkers = 6;

function randomEmployee(amountOfWorkers, worker) {
    let pickEmployee = []

    for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {

        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];

        validEmployee = false;
        while (!validEmployee) {
            sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker);
        }
    }

    return pickEmployee
}



function sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker) {
    localValidEmployee = false;
    while (!localValidEmployee) {
        let tempCheck = 0;
        for (let sameEmployeeCheckInterval = 1; sameEmployeeCheckInterval < amountOfWorkers; sameEmployeeCheckInterval++) {
            if (pickEmployee[amountOfWorkersCounter] === pickEmployee[amountOfWorkersCounter - sameEmployeeCheckInterval]) {
                tempCheck++;
                pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];
                sameEmployeeCheckInterval++;
            }                 
        }
        if (tempCheck === 0) {
            localValidEmployee = true;
        }   else sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker);
    return validEmployee = true;
    }   
}

const randomSchedule = () => {
    const schedule = {};

    for (let daysLength = 0; daysLength < days.length; daysLength++) {
        const day = days[daysLength];
        schedule[day] = {};

        for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
            const shift = shifts[shiftsLength];
            schedule[day][shift] = randomEmployee(amountOfWorkers, employees, schedule, day, shift);

        }
    }

    return schedule;
}

console.log(randomSchedule());

