const employees = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Fred', 'Grace', 'Helen', 'Irene', 'Jack', 'Kelly', 'Larry'];
const youthemployees = ['Mia', 'Nia', 'Oia', 'Pia', 'Qia', 'Ria', 'Sia', 'Tia', 'Uia', 'Via', 'Wia', 'Xia', 'Yia', 'Zia'];
const shifts = ["6-14", '14-22'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const unavailableEmployees = {
  "Monday": {},
  "Tuesday": {},
  "Wednesday": {},
  "Thursday": {},
  "Friday": {},
  "Saturday": {},
  "Sunday": {},
}


let amountOfWorkers = 5;

function randomEmployee(amountOfWorkers, worker, day) {
  let pickEmployee = []

  for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {

      pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];
      
      unavailableEmployees[day] = [pickEmployee];
      
      let sameEmployeeCheckInterval = 1;
      while (pickEmployee[amountOfWorkersCounter] === pickEmployee[amountOfWorkersCounter - sameEmployeeCheckInterval]) {
        pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)];
        sameEmployeeCheckInterval++;
      }
  }
  return pickEmployee
}

// Define a penalty function to penalize schedules that have too many youth employees working together
function youthPenalty(schedule) {
  let penalty = 0;

  for (const day of days) {
    for (const shift of shifts) {
      const workers = schedule[day][shift];
      const numYouthWorkers = workers.filter(worker => youthemployees.includes(worker)).length;

      // Penalize schedules that have more than one youth employee working together in a shift
      if (numYouthWorkers > 1) {
        penalty += numYouthWorkers;
      }
    }
  }

  return penalty;
}

const randomSchedule = () => {
  const schedule = {};

  for (let daysLength = 0; daysLength < days.length; daysLength++) {
    const day = days[daysLength];
    schedule[day] = {};

    for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
      const shift = shifts[shiftsLength];
      schedule[day][shift] = randomEmployee(amountOfWorkers, employees, day);

    }    
  }

  // Compute the penalty for the schedule
  const penalty = youthPenalty(schedule);

  // Return the schedule and its penalty
  return { schedule, penalty };
}

const populationSize = 100;
const mutationRate = 0.1;
const generations = 1000;

function crossover(parent1, parent2) {
  const child = {};

  for (const day of days) {
    child[day] = {};

    for (const shift of shifts) {
      child[day][shift] = Math.random() < 0.5 ? parent1[day][shift] : parent2[day][shift];
    }
  }

  return child;
}

function mutate(schedule) {
  for (const day of days) {
    for (const shift of shifts) {
      if (Math.random() < mutationRate) {
        schedule[day][shift] = randomEmployee(amountOfWorkers, employees, day);
      }
    }
  }
}

function geneticAlgorithm() {
  let population = Array.from({ length: populationSize }, () => randomSchedule().schedule);

  for (let generation = 0; generation < generations; generation++) {
    const fitness = population.map(schedule => -youthPenalty(schedule));
    const totalFitness = fitness.reduce((a, b) => a + b, 0);

    const newPopulation = [];

    for (let i = 0; i < populationSize; i++) {
      const parent1 = selectWeightedRandom(population, fitness, totalFitness);
      const parent2 = selectWeightedRandom(population, fitness, totalFitness);

      let child = crossover(parent1, parent2);
      mutate(child);

      newPopulation.push(child);
    }

    population = newPopulation;
  }

  const bestSchedule = population.reduce((best, schedule) => {
    return youthPenalty(schedule) < youthPenalty(best) ? schedule : best;
  });

  return bestSchedule;
}

function selectWeightedRandom(population, fitness, totalFitness) {
  const target = Math.random() * totalFitness;
  let cumulative = 0;

  for (let i = 0; i < population.length; i++) {
    cumulative += fitness[i];

    if (cumulative >= target) {
      return population[i];
    }
  }

  return population[population.length - 1];
}
console.log(unavailableEmployees);
const optimalSchedule = geneticAlgorithm();
console.log(optimalSchedule);