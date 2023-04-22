const employees = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Fred', 'Grace', 'Helen', 'Irene', 'Jack', 'Kelly', 'Larry', 'Mallory', 'Nora', 'Oscar', 'Peggy', 'Quinn', 'Robert'];
const youthemployees = ['Mia', 'Nia', 'Oia', 'Pia', 'Qia', 'Ria', 'Sia', 'Tia', 'Uia', 'Via', 'Wia', 'Xia', 'Yia', 'Zia', 'Aia', 'Bia', 'Cia', 'Dia', 'Eia', 'Fia', 'Gia', 'Hia', 'Iia', 'Jia', 'Kia'];
const shifts = ['6-14', '14-22', '17-22'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let fitnessValue = 0;
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



      if (shift === '17-22') {

        let temprandom = Math.floor(Math.random() * 2);

        if (temprandom === 0) {
          pickEmployee[amountOfWorkersCounter] = youthemployees[Math.floor(Math.random() * worker.length)];
        } else {
          pickEmployee[amountOfWorkersCounter] = employees[Math.floor(Math.random() * worker.length)];
        }
      }

      if (schedule[day].includes(pickEmployee[amountOfWorkersCounter])) {
        console.log('alreadyscheduled');
      }
      validEmployee = sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker);

      if (unavailableEmployees[day].includes(pickEmployee[amountOfWorkersCounter])) {
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

const fitness = (schedule) => {
  let value = 0;

  for (const day in schedule) {
    for (const shift in schedule[day]) {
      for (const employee of schedule[day][shift]) {
        if (employees.includes(employee)) {
          value += 100;
        } else if (youthemployees.includes(employee)) {
          value += 150;
        }
      }
    }
  }

  return value;
};

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
  fitnessValue = fitness(schedule);

  return schedule;
}

console.log(randomSchedule());
console.log("Total value:", fitnessValue);


