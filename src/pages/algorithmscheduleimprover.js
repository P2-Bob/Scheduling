const mysql = require('mysql2');

const employees1 = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Fred', 'Grace', 'Helen', 'Irene', 'Jack', 'Kelly', 'Larry', 'Mallory', 'Nora', 'Oscar', 'Peggy', 'Quinn', 'Robert'];
const youthemployees = ['Mia', 'Nia', 'Oia', 'Pia', 'Qia', 'Ria', 'Sia', 'Tia', 'Uia', 'Via', 'Wia', 'Xia', 'Yia', 'Zia', 'Aia', 'Bia', 'Cia', 'Dia', 'Eia', 'Fia', 'Gia', 'Hia', 'Iia', 'Jia', 'Kia'];
const shifts = ['6-14', '14-22', '17-22'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let fitnessValue = 0;
let amountOfWorkers = 3;

let unavailableEmployees = {
  "Monday": [],
  "Tuesday": [],
  "Wednesday": [],
  "Thursday": [],
  "Friday": [],
  "Saturday": [],
  "Sunday": [],
}

const employess = async (query) => {
  const value = [];

  const pool = mysql.createPool({
    host: "10.92.0.176",
    port: "3306",
    user: "root",
    password: "password",
    database: "P2-Bob",
  }).promise();

  try {
    const [results] = await pool.query(query, value);
    pool.end();
    return results;
  } catch (error) {
    throw Error(error.message);
  }
}

const randomEmployee = (amountOfWorkers, worker, youthEmployees, schedule, day, shift) => {
  let pickEmployee = []

  for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {

    pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;




    validCount = 0
    validEmployee = false;
    while (!validEmployee || validCount != 0) {
      validCount = 0
      validEmployee = false;



      if (shift === '17-22') {

        let temprandom = Math.floor(Math.random() * 2);

        if (temprandom === 0) {
          pickEmployee[amountOfWorkersCounter] = youthEmployees[Math.floor(Math.random() * youthEmployees.length)].username;
        } else {
          pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
        }
      }

      if (day === 'Saturday' || day === 'Sunday') {
        temprandom = Math.floor(Math.random() * 2);

        if (temprandom === 0) {
          pickEmployee[amountOfWorkersCounter] = youthEmployees[Math.floor(Math.random() * youthEmployees.length)].username;
        } else {
          pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
        }
      }

      validEmployee = sameEmployeeCheckShift(pickEmployee, amountOfWorkersCounter, worker);

      if (unavailableEmployees[day].includes(pickEmployee[amountOfWorkersCounter])) {
        validCount++;
      }



      if (!validEmployee || validCount != 0) {
        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
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
        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
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
        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
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

const fitness = (schedule, employees, youthEmployees, preference) => {
  let value = 0;

  for (const day in schedule) {
    for (const shift in schedule[day]) {
      for (const employee of schedule[day][shift]) {
        const hasEmployee = employees.some((e) => e.username === employee);
        const hasYouthEmployee = youthEmployees.some((e) => e.username === employee);
        if (hasEmployee) {
          value += 100;

          const employeePreference = preference.find((p) => p.username === employee);

          if (employeePreference) {
            if (employeePreference[day] === 1) {
              value += 50;
            }

            if (employeePreference[day] === 2) {
              value -= 50;
            }
          }

        } else if (hasYouthEmployee) {
          value += 150;

          const employeePreference = preference.find((p) => p.username === employee);

          if (employeePreference) {

            // 1 is preferred
            if (employeePreference[day] === 1) {
              value += 50;
            }
            // 2 is not preferred
            if (employeePreference[day] === 2) {
              value -= 50;
            }
            // 0 is whatever
            if (employeePreference[day] === 0) {
              value += 25;
            }
          }
        }
      }
    }
  }

  return value;
};

const randomSchedule = (employees, youthEmployees, preference) => {
  const schedule = {};

  for (let daysLength = 0; daysLength < days.length; daysLength++) {
    const day = days[daysLength];
    schedule[day] = [];

    for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
      const shift = shifts[shiftsLength];

      const pickedEmployee = randomEmployee(amountOfWorkers, employees, youthEmployees, schedule, day, shift);

      schedule[day][shift] = pickedEmployee;

    }
  }


  //console.log("Kig her: ", unavailableEmployees);
  fitnessValue = fitness(schedule, employees, youthEmployees, preference);

  unavailableEmployees = {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": [],
  }

  return schedule;
}

const randomEmployeeSwap = (amountOfWorkers, worker, employees, youthEmployees, preference, bestSchedule, swappedSchedule) => {

  for (let daysLength = 0; daysLength < days.length; daysLength++) {
    const day = days[daysLength];


    for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
      const shift = shifts[shiftsLength];
      let tempSwap = [];
      let randomSwap = Math.floor(Math.random() * 2);
      if (randomSwap === 0) {
        tempSwap = swappedSchedule[day][shift];
        let randomEmployeePicker = Math.floor(Math.random() * amountOfWorkers);
        pickEmployee = worker[Math.floor(Math.random() * worker.length)].username;
        tempSwap[randomEmployeePicker] = pickEmployee;


        swappedSchedule[day][shift] = tempSwap;
      }
    }
  }
  
  return swappedSchedule;
}



(async () => {
  const employees = await employess('SELECT username FROM users WHERE age >= 18');
  const youthEmployees = await employess('SELECT username FROM users WHERE age < 18');
  const preference = await employess('SELECT * FROM preference');

  let count = 0;
  let schedule = {};
  let bestSchedule = {};
  console.log("Searching for fittest schedule...");
  let highScore = 0;
  while (fitnessValue <= 7300) {
    schedule = randomSchedule(employees, youthEmployees, preference);
    //console.log("Total value:", fitnessValue);
    if (fitnessValue > highScore) {
      highScore = fitnessValue;
      bestSchedule = schedule;
      console.log("This is the current fittest schedule:", schedule);
      console.log("New high score:", highScore);
      console.log("Population:", count);

    }
    count++;
  }
  console.log("This is the fittest schedule:", schedule);
  console.log("Total value:", fitnessValue);
  console.log("Population:", count);
  console.log("Best schedule:", bestSchedule);


  let swappedSchedule = bestSchedule;
  let swappedFitnessValue = 0;


  swappedSchedule = bestSchedule
  randomEmployeeSwap(amountOfWorkers, employees, youthEmployees, employees, preference, bestSchedule, swappedSchedule);

  console.log(swappedSchedule);
  swappedFitnessValue = fitness(swappedSchedule, employees, youthEmployees, preference);
  console.log("Swapped Fitness", swappedFitnessValue);

  


})();




