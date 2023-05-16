

const mysql = require('mysql2');
const _ = require('lodash');



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

let bestUnavailableEmployees = {
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
	let pickEmployee = [];

	for (let amountOfWorkersCounter = 0; amountOfWorkersCounter < amountOfWorkers; amountOfWorkersCounter++) {

		//pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;


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
				tempCheck++;
				pickEmployee[amountOfWorkersCounter] = worker[Math.floor(Math.random() * worker.length)].username;
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
					let previousDay;
					switch (day) {
						case 'Monday':
							previousDay = 'Sunday';
							break;
						case 'Tuesday':
							previousDay = 'Monday';
							break;
						case 'Wednesday':
							previousDay = 'Tuesday';
							break;
						case 'Thursday':
							previousDay = 'Wednesday';
							break;
						case 'Friday':
							previousDay = 'Thursday';
							break;
						case 'Saturday':
							previousDay = 'Friday';
							break;
						case 'Sunday':
							previousDay = 'Saturday';
							break;
					}
					if (tempSchedule[previousDay]['14-22'].includes(employeeName) || tempSchedule[previousDay]['17-22'].includes(employeeName)) {
						//console.log(employeeName + ' is overworked');
						return false;
					}
				}

			}
		
			for (const employeeObj of youthEmployees) {
				const employeeName = employeeObj.username;
				
				if (tempSchedule[day]['6-14'].includes(employeeName)) 
				{
					let previousDay;
					switch (day) {
						case 'Monday':
							previousDay = 'Sunday';
							break;
						case 'Tuesday':
							previousDay = 'Monday';
							break;
						case 'Wednesday':
							previousDay = 'Tuesday';
							break;
						case 'Thursday':
							previousDay = 'Wednesday';
							break;
						case 'Friday':
							previousDay = 'Thursday';
							break;
						case 'Saturday':
							previousDay = 'Friday';
							break;
						case 'Sunday':
							previousDay = 'Saturday';
							break;
					}
					if (tempSchedule[previousDay]['14-22'].includes(employeeName) || tempSchedule[previousDay]['17-22'].includes(employeeName)) {
						//console.log(employeeName + ' is overworked');
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

/* const lastWorkedRow = (schedule, youthEmployees) => {
	let employeesWithoutConsecutiveDaysOff = [];
	
	let offInARowCounter = 0;
	for (const day in schedule) {
		for (const shift in schedule[day]) {
			for (const employeeObj of youthEmployees) {
				if (!(schedule[day].includes(employeeObj.username))) {

					let previousDay;
					console.log("hallo din bums")
					switch (day) {
						case 'Monday':
							previousDay = 'Sunday';
							break;
						case 'Tuesday':
							previousDay = 'Monday';
							break;
						case 'Wednesday':
							previousDay = 'Tuesday';
							break;
						case 'Thursday':
							previousDay = 'Wednesday';
							break;
						case 'Friday':
							previousDay = 'Thursday';
							break;
						case 'Saturday':
							previousDay = 'Friday';
							break;
						case 'Sunday':
							previousDay = 'Saturday';
							break;
					}
					if (!(schedule[previousDay].includes(employeeObj.username))) {
						offInARowCounter++;
						if (offInARowCounter === 1) {
							//console.log(offInARowCounter)
						}
					}
				}
			}
			offInARowCounter = 0;
		}
	}
}; */

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
						//console.log(counterHasEmployee);
						//console.log(value)
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
					//console.log("hej");
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


	//console.log("Kig her: ", unavailableEmployees);
	//fitnessValue = fitness(schedule, employees, youthEmployees, preference);
	bestUnavailableEmployees = _.cloneDeep(unavailableEmployees)
	//console.log("bestUnavailable", bestUnavailableEmployees)


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
			//console.log("randomSwap: ", randomSwap);
			if (randomSwap === 1) {
				tempSwap = bestSchedule[day][shift];
				let randomEmployeePicker = Math.floor(Math.random() * amountOfWorkers);
				pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
				let worker = null;
				let validCount = 0;
				let validEmployee = false;
				while (!validEmployee || validCount != 0) {
					validCount = 0
					validEmployee = false;
					if ((shift === '6-14' || shift === '14-22') && day !== 'Saturday' && day !== 'Sunday') {
						pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
						//console.log("pickEmployee2: ", pickEmployee);
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

					validEmployee = sameEmployeeCheckShift(pickEmployee, 1, worker);

					if (bestUnavailableEmployees[day].includes(pickEmployee)) {
						validCount++;
					} 



					if (!validEmployee || validCount != 0) {
						pickEmployee = employees[Math.floor(Math.random() * employees.length)].username;
					}
					
				}
				//console.log(pickEmployee);
				
				let beforeSwapEmployee = tempSwap[randomEmployeePicker];
				//console.log("before:", beforeSwapEmployee);
				//console.log("after:", pickEmployee);

				let index = bestUnavailableEmployees[day].indexOf(beforeSwapEmployee);
				//console.log(bestUnavailableEmployees[day])
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
	//console.log(bestUnavailableEmployees);
	return swappedSchedule;
} 

const supervisorCheck = (schedule, employees) => {

};

const generateSchedule = async (employees, youthEmployees, preference) => {

	let count = 0;
	let schedule = {};
	let bestSchedule = {};
	fitnessValue = 0;
	console.log("Searching for fittest schedule...");
	let highScore = 0;

	while (fitnessValue <= 7200) {
		//console.log("før", unavailableEmployees);
		schedule = randomSchedule(employees, youthEmployees, preference);
		fitnessValue = fitness(schedule, employees, youthEmployees, preference);
		//console.log("efter",bestUnavailableEmployees);
		//console.log("Total value:", fitnessValue);
		if (fitnessValue > highScore) {
			highScore = fitnessValue;
			bestSchedule = _.cloneDeep(schedule);
			//bestUnavailableEmployees = _.cloneDeep(unavailableEmployees)
			//console.log("efter",bestUnavailableEmployees);
			//console.log("This is the current fittest schedule:", schedule);
			//console.log("New high score:", highScore);
			//console.log("Population:", count);

		}
		count++;
	}
	console.log("This is the fittest schedule:", schedule);
	console.log("Total value:", fitnessValue);
	console.log("Population:", count);
	//console.log("Lille check", getOverworkedEmployeeCheck(schedule, employees, youthEmployees));
	


	let swappedSchedule = _.cloneDeep(bestSchedule);
	let swappedFitnessValue = 0;

	let swapTries = 0;
	while (swappedFitnessValue < fitnessValue + 101) {
		swappedSchedule = _.cloneDeep(bestSchedule);

		swappedSchedule = randomEmployeeSwap(amountOfWorkers, employees, youthEmployees, preference, bestSchedule, swappedSchedule);
		swappedFitnessValue = fitness(swappedSchedule, employees, youthEmployees, preference);
		//console.log("Swapped Fitness", swappedFitnessValue);
		
		//const overworkedEmployeeCheck = OverworkedEmployeeCheck(swappedSchedule, day, pickEmployee, amountOfWorkersCounter, shift, employees);

		swapTries++;
		if (swapTries > 1000000) {
			swappedSchedule = _.cloneDeep(bestSchedule);
			break;
		}

	}
	console.log("Tries:", swapTries);
	console.log("Total value:", fitnessValue);
	console.log("Swapped Fitness", swappedFitnessValue);
	console.log("Swapped Schedule", swappedSchedule);
	//console.log("Lille check", lastWorkedRow(swappedSchedule, youthEmployees));

	return Promise.resolve({schedule: swappedSchedule, fitnessValue: swappedFitnessValue, count: swapTries})
};


export default generateSchedule;

