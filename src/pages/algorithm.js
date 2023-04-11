const employees = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Fred', 'Grace', 'Helen', 'Irene', 'Jack', 'Kelly', 'Larry'];
const youthemployees = ['Mia', 'Nia', 'Oia', 'Pia', 'Qia', 'Ria', 'Sia', 'Tia', 'Uia', 'Via', 'Wia', 'Xia', 'Yia', 'Zia'];
const shifts = ['6-14', '14-22', '22-6'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let amountOfWorkers = 6;

const randomEmployee = (amountOfWorkers, worker, schedule, day, shift) => {
    let pickEmployee = []

    for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {

        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];


        validCount = 0
        validEmployee = false;
        while (!validEmployee) {
            if (schedule[day].includes(pickEmployee[amountOfWorkersCounter])) {
                console.log('alreadyscheduled');
            }
            validEmployee = sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker);

            let obj = schedule[day]
            if (schedule.hasOwnProperty(day) && schedule[day].hasOwnProperty(shift)) {
                const arr = Object.entries(schedule[day][shift])[0][1];
                console.log(arr.flat());
            }



            sameEmployeeCheckDay(schedule, day, pickEmployee, amountOfWorkersCounter, shift, worker);


        }
    }

    return pickEmployee
}


const sameEmployeeCheckShift = (pickEmployee, amountOfWorkersCounter, worker) => {
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
        } else sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker);
    }
    return true;
}


const sameEmployeeCheckDay = (schedule, day, pickEmployee, amountOfWorkersCounter, shift, worker) => {


    let tempshift = shifts[shifts.indexOf(shift) - 1];

    localValidEmployee = false;
    while (!localValidEmployee) {
        let tempCheck = 0;

        if (schedule[day][tempshift]) {
            if (schedule[day][tempshift].includes(pickEmployee[amountOfWorkersCounter])) {
                tempCheck++;
                pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];
            }
        }
        if (sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker)) {
        } else {
            tempCheck++;
        }

        if (tempCheck === 0) {
            localValidEmployee = true;
        } else sameEmployeeCheckDay(schedule, day, pickEmployee, amountOfWorkersCounter, shift, worker);

    }
}


const randomSchedule = () => {
    const schedule = {};

    for (let daysLength = 0; daysLength < days.length; daysLength++) {
        const day = days[daysLength];
        schedule[day] = [];

        for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
            const shift = shifts[shiftsLength];
            schedule[day][shift] = randomEmployee(amountOfWorkers, employees, schedule, day, shift);

        }
    }

    return schedule;
}

console.log(randomSchedule());