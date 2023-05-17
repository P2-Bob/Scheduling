import Head from 'next/head'
import styles from '@/styles/Employees.module.css'
import { executeQuery } from '../../../lib/db'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '../components/navBar'

export async function getServerSideProps(ctx) {

    const session = await getSession(ctx);

    if (session) {
        // Fetch data from database
        const users = await executeQuery({
            query: 'SELECT * FROM users',
            value: []
        })

        const departments = await executeQuery({
            query: 'SELECT * FROM departments',
            value: []
        })

        const schedule = await executeQuery({
            query: 'SELECT * FROM schedule',
            value: []
        })

        return {
            props: {
                users: users,
                departments: departments,
                schedule: schedule,
            },
        }
    } else {
        return {
            props: {
                users: null,
                departments: null,
                schedule: null,
          },
        }
    }
}

export default function employees({ users, departments, schedule }) {

    const [selectedRole, setSelectedRole] = useState(
        users.reduce((acc, user) => {
            acc[user.username] = user.role;
            return acc;
        }, {})
    );
      
    const [selectedDepartment, setSelectedDepartment] = useState(
        users.reduce((acc, user) => {
            acc[user.username] = departments.find(
                (department) => department.department_id === user.department_id
            )?.department_name;
            return acc;
        }, {})
    );
      
    const [employees, setEmployees] = useState(users);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deletingEmployee, setDeletingEmployee] = useState(null);
    const [creatingEmployee, setCreatingEmployee] = useState(false);


    const editingEmployeeHandler = (username) => {
        setEditingEmployee(username);
    }
    
    const deletingEmployeeHandler = (username) => {
        setDeletingEmployee(username);
    };

    const creatingEmployeeHandler = () => {
        setCreatingEmployee(!creatingEmployee);
    };

    const roleChangeHandler = (event, username) => {
        setSelectedRole({
            ...selectedRole,
            [username]: event.target.value,
        });
    };
      

    const departmentChangeHandler = (event, username) => {
        setSelectedDepartment({
            ...selectedDepartment,
            [username]: event.target.value,
        });
    };
    


    const deleteEmployeeHandler = async (username) => {
        
        // delete the employee from the database
        const result = await fetch('/api/deleteEmployee', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
            })
        });

        if (!result.ok) {
            alert('Something went wrong!');
            return;
        }
        
        // delete the employee from the employees array
        const updatedEmployees = employees.filter(
            (employee) => employee.username !== username
        );
        // update the employees array
        setEmployees(updatedEmployees);

        // reset the deletingEmployee state
        setDeletingEmployee(null);

        alert('Employee updated successfully!');

    }
    


    const editEmployeeHandler = async (event) => {
        event.preventDefault();

        const name = event.target.name.value;
        const username = event.target.username.value;
        const age = event.target.age.value;
        const departmentName = event.target.department.value;
        const role = event.target.role.value;

        // check if the username is changed
        if (username !== editingEmployee) {
            // if so check if the username already exists
            const usernameExists = employees.some(
                (employee) => employee.username === username
            );

            if (usernameExists) {
                alert('Username already taken!');
                return;
            }
        }

        // get id of the department from the departments array
        const department_id = departments.find(
            (department) => department.department_name === departmentName
        ).department_id;


        console.log(name, username, age, department_id, role);

        /* const result = await executeQuery({
            query: 'UPDATE users SET name = ?, username = ?, age = ?, department_id = ?, role = ? WHERE username = ?',
            value: [name, username, age, department, role, editingEmployee]
        }) */

        const result = await fetch('/api/updateEmployee', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                name: name,
                role: role,
                age: age,
                department_id: department_id,
                editingEmployee: editingEmployee
            })
        });

        if (!result.ok) {
            alert('Something went wrong!');
            return;
        }

        // find the employee in the employees array and update it
        const updatedEmployees = employees.map((employee) => {
            if (employee.username === editingEmployee) {
                return {
                    ...employee,
                    name,
                    username,
                    age,
                    department_id,
                    role,
                };
            }
            return employee;
        });
        // update the employees array
        setEmployees(updatedEmployees);

        // reset the editingEmployee state
        setEditingEmployee(null);

        alert('Employee updated successfully!');

    }

    const createEmployeeHandler = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        const role = event.target.role.value;
        const age = event.target.age.value;
        const departmentName = event.target.department.value;

        // check if the username already exists
        const usernameExists = employees.some(
            (employee) => employee.username === username
        );

        if (usernameExists) {
            alert('Username already taken!');
            return;
        }

        // get id of the department from the departments array
        const department_id = departments.find(
            (department) => department.department_name === departmentName
        ).department_id;
        
        const result = await fetch('/api/createEmployee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                name: name,
                role: role,
                age: age,
                department_id: department_id
            })
        });

        if (!result.ok) {
            alert('Something went wrong!');
            return;
        }

        // update the employees array
        setEmployees([
            {
                username,
                password,
                name,
                role,
                age,
                department_id,
            },
            ...employees,
        ]);

        // reset the creatingEmployee state
        setCreatingEmployee(false);

        alert('Employee created successfully!');

    }
    let employeesWorkTime = [];
    for (const employee in employees) {
        let workTime = 0;
        for (const shift in schedule) {
            if (schedule[shift].username === employees[employee].username) {
                if (schedule[shift].shift_id === 1 || schedule[shift].shift_id === 2) {
                    workTime += 8;
                } else {
                    workTime += 5;
                }
            }
        }

        employeesWorkTime.push({username: employees[employee].username, workTime: workTime});
    }

    const updatedEmployees = employees.map((employee) => {
        const workTimeEntry = employeesWorkTime.find((entry) => entry.username === employee.username);

        if (workTimeEntry) {
            return { ...employee, workTime: workTimeEntry.workTime };
        } else {
            return { ...employee, workTime: 0 };
        }
    });

    useEffect(() => {
        setEmployees(updatedEmployees);
    }, [schedule]);

    const { data: session } = useSession();
    let unAuthorized = true;
    let foundUser = null;
    if (session) {

        foundUser = users.find(user => user.username === session.user.name);

        if (foundUser.role != 'admin') {
            unAuthorized = true;
        } else {
            unAuthorized = false;
        }
    }

    const router = useRouter();
    const { status: sessionStatus } = useSession();
    const loading = sessionStatus === 'loading';

    useEffect(() => {
        // check if the session is loading or the router is not ready
        if (loading || !router.isReady) return;

        // if the user is not authorized, redirect to the front page
        if (unAuthorized) {
            console.log('not authorized');
            router.push({
              pathname: '/',
            });
          }

    }, [loading, unAuthorized, sessionStatus, router]);

    if (loading) {
        return <>Loading app...</>;
    }

    if (!unAuthorized) {
        return (
            <>
                <Head>
                    <title>Market Scheduling - Manage Employees</title>
                    <meta name="description" content="Admin page" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar user={foundUser} />
                <div className={styles.main}>
                    <div className={styles.headerInfo}>
                        <h1>Employee Section</h1>
                        <p>Welcome to the employee section, what do you wanna do?</p>
                    </div>
                    {creatingEmployee ? (
                        <>
                            <div className={styles.createUser}>
                                <h2>Create Employee</h2>
                                <form onSubmit={createEmployeeHandler}>
                                    <div className={styles.createUserForm}>
                                        <div className={styles.createUserInputWrapper}>
                                            <label htmlFor="username">Username</label>
                                            <input type="text" id="username" name="username" placeholder="Username" />
                                        </div>
                                        <div className={styles.createUserInputWrapper}>
                                            <label htmlFor="Password">Password</label>
                                            <input type="password" id="password" name="password" placeholder="Password" />
                                        </div>
                                        <div className={styles.createUserInputWrapper}>
                                            <label htmlFor="name">Full Name</label>
                                            <input type="text" id="name" name="name" placeholder="Name" />
                                        </div>
                                        <div className={styles.createUserInputWrapper}>
                                            <label htmlFor="role">Role</label>
                                            <select id="role" name="role">
                                                <option value="employee">Employee</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className={styles.createUserInputWrapper}>
                                            <label htmlFor="age">Age</label>
                                            <input type="number" id="age" name="age" placeholder="Age" />
                                        </div>
                                        <div className={styles.createUserInputWrapper}>
                                            <label htmlFor="department">Department</label>
                                            <select id="department" name="department">
                                                {
                                                    departments.map((department) => (
                                                        <option key={department.department_id} value={department.department_name}>{department.department_name}</option>
                                                        ))
                                                    }
                                            </select>
                                        </div>
                                    </div>
                                    <div className={styles.createUserButtons}>
                                        <button type="button" className={styles.backButton} onClick={creatingEmployeeHandler}>Back</button>
                                        <button type="submit" className={styles.submitButton}>Create</button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className={styles.createUserButtonContainer}>
                            <button type="button" className={styles.submitButton} onClick={creatingEmployeeHandler}>+</button>
                        </div>
                    )}
                    <div className={styles.employeeList}>
                        {
                            employees.map((employee) => (
                                <div className={styles.employeeCard} key={employee.username}>
                                    {editingEmployee === employee.username ? (
                                        <div className={styles.editEmployee}>
                                            <h2>Edit Employee</h2>
                                            <form onSubmit={editEmployeeHandler} >
                                                <div className={styles.inputWrapper}>
                                                    <label htmlFor="name">Name</label>
                                                    <input type="text" id="name" name="name" placeholder={employee.name} defaultValue={employee.name} />
                                                </div>
                                                <div className={styles.inputWrapper}>
                                                    <label htmlFor="username">Username</label>
                                                    <input type="text" id="username" name="username" placeholder={employee.username} defaultValue={employee.username} />
                                                </div>
                                                <div className={styles.inputWrapper}>
                                                    <label htmlFor="age">Age</label>
                                                    <input type="number" id="age" name="age" placeholder={employee.age} defaultValue={employee.age} />
                                                </div>
                                                <div className={styles.inputWrapper}>
                                                    <label htmlFor="department">Department</label>
                                                    <select
                                                        id="department"
                                                        name="department"
                                                        value={selectedDepartment[employee.username]}
                                                        onChange={(event) => departmentChangeHandler(event, employee.username)}
                                                        >
                                                        {departments.map((department) => (
                                                            <option key={department.department_id} value={department.department_name}>
                                                            {department.department_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className={styles.inputWrapper}>
                                                    <label htmlFor="role">Role</label>
                                                    <select
                                                        id="role"
                                                        name="role"
                                                        value={selectedRole[employee.username]}
                                                        onChange={(event) => roleChangeHandler(event, employee.username)}
                                                        >
                                                        <option value="employee">Employee</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                                <div className={styles.editEmployeeButtons}>
                                                    <button type="button" className={styles.backButton} onClick={editingEmployeeHandler}>Back</button>
                                                    <button type="submit" className={styles.submitButton}>Submit</button>
                                                </div>
                                            </form>
                                        </div>

                                    ) : deletingEmployee === employee.username ? (
                                            <>
                                                <div className={styles.avatar}>
                                                    {employee.name.split(" ")[0].charAt(0)}
                                                    {employee.name.split(" ").slice(-1)[0].charAt(0)}
                                                </div>
                                                <h2>{employee.name}</h2>
                                                <p>Are you sure you want to delete this employee?</p>
                                                <div className={styles.employeeButtons}>
                                                    <button type="button" className={styles.backButton} onClick={deletingEmployeeHandler}>No</button>
                                                    <button type="button" className={styles.deleteButtonSubmit} onClick={() => deleteEmployeeHandler(employee.username)}>Yes</button>
                                                </div>
                                            </>
                                    ) : (
                                        <>
                                        <div className={styles.avatar}>
                                            {employee.name.split(" ")[0].charAt(0)}
                                            {employee.name.split(" ").slice(-1)[0].charAt(0)}
                                        </div>
                                        <h2>{employee.name}</h2>
                                        <p><strong>Username:</strong> {employee.username}</p>
                                        <p><strong>Age:</strong> {employee.age}</p>
                                        <p><strong>Department:</strong> {departments.find(department => department.department_id === employee.department_id)?.department_name}</p>
                                        <p><strong>Hours Worked:</strong> {employee.workTime}</p>
                                        <div className={styles.employeeButtons}>
                                            <button className={styles.editButton} onClick={() => editingEmployeeHandler(employee.username)}>
                                                Edit
                                            </button>
                                            <button className={styles.deleteButton} onClick={() => deletingEmployeeHandler(employee.username)}>
                                                Delete
                                            </button>
                                        </div>
                                        </>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </>
        )
    } else {
        return <>unAuthorized</>;
    }
}