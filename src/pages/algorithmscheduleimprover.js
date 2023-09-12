const mysql = require('mysql2');
const _ = require('lodash');

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

let bestUnavailableEmployees = {
	"Monday": [],
	"Tuesday": [],
	"Wednesday": [],
	"Thursday": [],
	"Friday": [],
	"Saturday": [],
	"Sunday": [],
}


const randomEmployee = (amountOfWorkers, worker, youthEmployees, schedule, day, shift) => {
	let pickEmployee = [];

	for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {
		if ((shift === '6-14' || shift === '14-22') && day !== 'Saturday' && day !== 'Sunday') {
            pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
        } else {
            if (shift === '17-22') {
                let temprandom = Math.floor(Math.random() * 2);
                if (temprandom === 0) {
                    pickEmployee[amountOfWorkersCounter] = youthEmployees[Math.floor(Math.random() * youthEmployees.length)].username;
                } else {
                    pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
                }
            }
            if (day === 'Saturday' || day === 'Sunday') {
                let temprandom = Math.floor(Math.random() * 2);
                if (temprandom === 0) {
                    pickEmployee[amountOfWorkersCounter] = youthEmployees[Math.floor(Math.random() * youthEmployees.length)].username;
                } else {
                    pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
                }
            }
			if (day === 'Saturday' || day === 'Sunday') {
				if (shift === '6-14' || shift === '14-22') {
					if (amountOfWorkers === 2) {
						const found1 = worker.find(element => element.username === pickEmployee[0]);
						const found2 = worker.find(element => element.username === pickEmployee[1]);
						if (!found1 || !found2) {
							pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
						}
					}
				}
			}
        }

		let validCount = 0;
		let validEmployee = false;
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
				let temprandom = Math.floor(Math.random() * 2);

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
	if (amountOfWorkersCounter === 0) {
		return true;
	}
	let recursionCount = 0;

	let localValidEmployee = false;
	while (!localValidEmployee || recursionCount < 20) {
		localValidEmployee = false;
		let tempCheck = 0;
		for (let sameEmployeeCheckInterval = 1; sameEmployeeCheckInterval < amountOfWorkers; sameEmployeeCheckInterval++) {
			if (pickEmployee[amountOfWorkersCounter] === pickEmployee[amountOfWorkersCounter - sameEmployeeCheckInterval]) {
				//console.log("hey", pickEmployee[amountOfWorkersCounter], pickEmployee[amountOfWorkersCounter - sameEmployeeCheckInterval])
				tempCheck++;
				pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
				console.log
				sameEmployeeCheckInterval++;
			}
			if (recursionCount > 20) {
				console.log("oopsies");
			}

		}


		if (tempCheck === 0) {
			localValidEmployee = true;
		} recursionCount++;;
	}
	return true;
}

const getOverworkedEmployeeCheck = (schedule, employees, youthEmployees) => {
	const tempSchedule = _.cloneDeep(schedule);
	const lastWorkedObj = [];
	for (const day in tempSchedule) {
		for (const shift in tempSchedule[day]) {
			for (const employeeObj of employees) {
				const employeeName = employeeObj.username;				
				if (tempSchedule[day]['6-14'].includes(employeeName)) 
				{
					const dayIndex = days.indexOf(day);
					let previousDayIndex;
					if (dayIndex === 0) {
						previousDayIndex = 6;
					} else {
						previousDayIndex = dayIndex - 1;
					}
					const previousDay = days[previousDayIndex];

					if (tempSchedule[previousDay]['14-22'].includes(employeeName) || tempSchedule[previousDay]['17-22'].includes(employeeName)) {
						return false;
					}
				}

			}
		
			for (const employeeObj of youthEmployees) {
				const employeeName = employeeObj.username;
				
				if (tempSchedule[day]['6-14'].includes(employeeName)) 
				{
					const dayIndex = days.indexOf(day);
					let previousDayIndex;
					if (dayIndex === 0) {
						previousDayIndex = 6;
					} else {
						previousDayIndex = dayIndex - 1;
					}
					const previousDay = days[previousDayIndex];
					
					if (tempSchedule[previousDay]['14-22'].includes(employeeName) || tempSchedule[previousDay]['17-22'].includes(employeeName)) {
						return false;
					}
				}
			}
		}	
	}
	return true;
}


const daysInARow = (schedule, employees) => {
	const lastWorkedObj = [];
	let inARowCounter = 0;
	for (const day in schedule) {
		for (const shift in schedule[day]) {
			for (const employeeObj of employees) {
				if (schedule[day][shift].includes(employeeObj.username)) {
					inARowCounter++;
					const employeeName = employeeObj.username;
					const lastWorked = { day: day, shift: shift, DaysinARow: inARowCounter, employee: employeeName};
					lastWorkedObj.push(lastWorked);
					if (inARowCounter > 6) {
						return false;
					}
				}
			}
			inARowCounter = 0;
		}
	}
	return true;
};

const lastWorkedRow = (schedule, youthEmployees) => {
    let employeesWithoutConsecutiveDaysOff = [];
    for (const employeeObj of youthEmployees) {
        let offInARowCounter = 0;
        let maxOffInARowCounter = 0;
        for (const day in schedule) {
            let isOnShift = false;
            for (const shift in schedule[day]) {
                if (schedule[day][shift].includes(employeeObj.username)) {
                    isOnShift = true;
                    offInARowCounter = 0;
                    break;
                }
            }
            if (!isOnShift) {
                offInARowCounter++;
                if (offInARowCounter > maxOffInARowCounter) {
                    maxOffInARowCounter = offInARowCounter;
                }
            }
        }
        employeesWithoutConsecutiveDaysOff.push({
            employee: employeeObj.username,
            maxOffInARow: maxOffInARowCounter,
        });
    } 
    for (const employee of employeesWithoutConsecutiveDaysOff) {
        if (employee.maxOffInARow < 2) {
            return false;
        }
    }
    return true;
};

  
  

const fitness = (schedule, employees, youthEmployees, preference) => {
	let value = 0;
	let counterHasEmployee = 0;
	for (const day in schedule) {
		for (const shift in schedule[day]) {
			for (const employee of schedule[day][shift]) {
				const hasEmployee = employees.some((e) => e.username === employee);
				const hasYouthEmployee = youthEmployees.some((e) => e.username === employee);
				if (hasEmployee) {
					counterHasEmployee = 0;
					if (day === 'Saturday' && shift === '6-14') {
					} else if (day === 'Saturday' && shift === '14-22') {
					} else if (day === 'Sunday' && shift === '6-14') {
					} else if (day === 'Sunday' && shift === '14-22') {
					}
					if ((day === 'Saturday' || day === 'Sunday') && shift === '6-14' || shift === '14-22') {
						counterHasEmployee++;
						if (counterHasEmployee === 0) {
							value -= 10000;
							counterHasEmployee = 0;
						}
					}
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
				if (unavailableEmployees[day].includes(schedule[day])) {
					value -= 1000;
				}
			}
		}
	}

	if (getOverworkedEmployeeCheck(schedule, employees, youthEmployees) === false){
		value -= 10000;
	}
	if (daysInARow(schedule, employees) === false) {
		value -= 10000;
	}
	if (lastWorkedRow(schedule, youthEmployees) === false) {
		value -= 10000;
	}
	return value;
};

const randomSchedule = (employees, youthEmployees, preference) => {
	const schedule = {};
	for (let daysLength = 0; daysLength < days.length; daysLength++) {
		const day = days[daysLength];
		schedule[day] = {};
		for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
			const shift = shifts[shiftsLength];
			const pickedEmployee = randomEmployee(amountOfWorkers, employees, youthEmployees, schedule, day, shift);
			schedule[day][shift] = pickedEmployee;

		}
	}
	bestUnavailableEmployees = _.cloneDeep(unavailableEmployees)

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

const randomEmployeeSwap = (amountOfWorkers, employees, youthEmployees, preference, bestSchedule, swappedSchedule) => {

	for (let daysLength = 0; daysLength < days.length; daysLength++) {
		const day = days[daysLength];


		for (let shiftsLength = 0; shiftsLength < shifts.length; shiftsLength++) {
			const shift = shifts[shiftsLength];
			let tempSwap = [];
			let randomSwap = Math.floor(Math.random() * 2);
			let pickEmployee;
			if (randomSwap === 1) {
				tempSwap = bestSchedule[day][shift];
				let randomEmployeePicker = Math.floor(Math.random() * amountOfWorkers);
				pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
				console.log("hey", pickEmployee)
				let worker = null;
				let validCount = 0;
				let validEmployee = false;
				while (!validEmployee || validCount != 0) {
					validCount = 0
					validEmployee = false;
					if ((shift === '6-14' || shift === '14-22') && day !== 'Saturday' && day !== 'Sunday') {
						pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
						console.log("hey1", pickEmployee)
					} else {
						if (shift === '17-22') {
							let temprandom = Math.floor(Math.random() * 2);
							if (temprandom === 0) {
								pickEmployee = youthEmployees[Math.floor(Math.random() * youthEmployees.length)].username;
							} else {
								pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
							}
						}
						if (day === 'Saturday' || day === 'Sunday') {
							let temprandom = Math.floor(Math.random() * 2);
							if (temprandom === 0) {
								pickEmployee = youthEmployees[Math.floor(Math.random() * youthEmployees.length)].username;
							} else {
								pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
							}
						}
						if (day === 'Saturday' || day === 'Sunday') {
							if (shift === '6-14' || shift === '14-22') {
								const found1 = employees.find(element => element.username === tempSwap[0]);
								const found2 = employees.find(element => element.username === tempSwap[1]);
								const found3 = employees.find(element => element.username === tempSwap[2]);
								if (!found1 && !found2 || !found2 && !found3 || !found1 && !found3) {
									const found4 = employees.find(element => element.username === tempSwap[randomEmployeePicker]);
									if (found4) {
										pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
									}
								}
								
							}
						}
					}

					if (youthEmployees.includes(pickEmployee)) {
						worker = youthEmployees;
					} else { worker = employees; }

					console.log("hey2", pickEmployee)

					validEmployee = sameEmployeeCheckShift(pickEmployee, 1, worker);

					console.log("hey3", validEmployee)

					if (bestUnavailableEmployees[day].includes(pickEmployee)) {
						validCount++;
					} 

					if (!validEmployee || validCount != 0) {
						pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
					}
					
				}
				let beforeSwapEmployee = tempSwap[randomEmployeePicker];
				let index = bestUnavailableEmployees[day].indexOf(beforeSwapEmployee);
				if (index !== -1) {
					bestUnavailableEmployees[day].splice(index, 1);
				}

				tempSwap[randomEmployeePicker] = pickEmployee;
				swappedSchedule[day][shift] = tempSwap;
				bestUnavailableEmployees[day] = bestUnavailableEmployees[day].concat(pickEmployee);
				break;
			}
		}
	}
	return swappedSchedule;
} 

const generateSchedule = async (employees, youthEmployees, preference) => {

	let count = 0;
	let schedule = {};
	let bestSchedule = {};
	fitnessValue = 0;
	console.log("Searching for fittest schedule...");
	let highScore = 0;

	while (fitnessValue <= 7200) {
		schedule = randomSchedule(employees, youthEmployees, preference);
		fitnessValue = fitness(schedule, employees, youthEmployees, preference);
		if (fitnessValue > highScore) {
			highScore = fitnessValue;
			bestSchedule = _.cloneDeep(schedule);

		}
		count++;
	}
	//console.log("This is the fittest schedule:", schedule);
	console.log("Total value:", fitnessValue);
	console.log("Population:", count);

	
	let swappedSchedule = _.cloneDeep(bestSchedule);
	let swappedFitnessValue = 0;
	
	
	
	let swapTries = 0;
	console.log("hey", swappedFitnessValue, fitnessValue)
	while (swappedFitnessValue < fitnessValue + 101) {
		swappedSchedule = _.cloneDeep(bestSchedule);
		swappedSchedule = randomEmployeeSwap(amountOfWorkers, employees, youthEmployees, preference, bestSchedule, swappedSchedule);
		console.log("hey1", swappedFitnessValue, fitnessValue)
		swappedFitnessValue = fitness(swappedSchedule, employees, youthEmployees, preference);
		
		swapTries++;
		if (swapTries > 1000000) {
			swappedSchedule = bestSchedule;
			break;
		}
		
	}
	console.log("Tries:", swapTries);
	console.log("Total value:", fitnessValue);
	console.log("Swapped Fitness", swappedFitnessValue);
	console.log("Swapped Schedule", swappedSchedule);

	return Promise.resolve({schedule: swappedSchedule, fitnessValue: swappedFitnessValue, count: swapTries})
};

export default generateSchedule;	