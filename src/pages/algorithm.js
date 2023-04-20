const employees = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Fred', 'Grace', 'Helen', 'Irene', 'Jack', 'Kelly', 'Larry', 'Mallory', 'Nora', 'Oscar', 'Peggy', 'Quinn', 'Robert', 'Trent', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zoe'];
const youthemployees = ['Mia', 'Nia', 'Oia', 'Pia', 'Qia', 'Ria', 'Sia', 'Tia', 'Uia', 'Via', 'Wia', 'Xia', 'Yia', 'Zia'];
const shifts = ['6-14', '14-22', '22-6'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let amountOfWorkers = 6;

const unavailableEmployees = {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": [],
}

const randomEmployee = (amountOfWorkers, worker, schedule, day, shift) => {
    let pickEmployee = []

    for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {

        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];

        
        

        validCount = 0
        validEmployee = false;
        while (!validEmployee || validCount != 0) {
            validCount = 0
            validEmployee = false;

            if (schedule[day].includes(pickEmployee[amountOfWorkersCounter])) {
                console.log('alreadyscheduled');
            }
            validEmployee = sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker);

            if(unavailableEmployees[day].includes(pickEmployee[amountOfWorkersCounter])){
                validCount++;
            }
            
           

            if (!validEmployee || validCount != 0) {
                pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];
            }

        }
        
    }
    unavailableEmployees[day] = unavailableEmployees[day].concat(pickEmployee);
    
    

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
            
            
            const pickedEmployee = randomEmployee(amountOfWorkers, employees, schedule, day, shift);

            schedule[day][shift] = pickedEmployee;

           
            

        }
    }
    console.log("Kig her: ", unavailableEmployees);
    return schedule;
}

console.log(randomSchedule());