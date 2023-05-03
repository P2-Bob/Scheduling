import Head from 'next/head'
import styles from '@/styles/Employees.module.css'
import { executeQuery } from '../../../lib/db'
import { getSession } from 'next-auth/react'
import { useSession } from 'next-auth/react'
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

        return {
            props: {
                users: users,
                departments: departments,
            },
        }
    } else {
        return {
            props: {
                users: null,
                departments: null,
          },
        }
    }
}

export default function Profile({ users, departments }) {

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


    const editingEmployeeHandler = (username) => {
        setEditingEmployee(username);
    }

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
    

    const deletingEmployeeHandler = async (username) => {
        setDeletingEmployee(username);
    };

    const deleteEmployeeHandler = async (username) => {
        
        
        
        // delete the employee from the employees array
        const updatedEmployees = employees.filter(
            (employee) => employee.username !== username
        );
        // update the employees array
        setEmployees(updatedEmployees);

        // reset the deletingEmployee state
        setDeletingEmployee(null);

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
                    <title>My Website - Manage Employees</title>
                    <meta name="description" content="Admin page" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar name={foundUser.name} />
                <div className={styles.main}>
                    <div className={styles.headerInfo}>
                        <h1>Employee Section</h1>
                        <p>Welcome to the employee section, what do you wanna do?</p>
                    </div>
                    
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
                                                    <button type="button" className={styles.editButtonBack} onClick={editingEmployeeHandler}>Back</button>
                                                    <button type="submit" className={styles.editButtonSubmit}>Submit</button>
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
                                                    <button type="button" className={styles.deleteButtonBack} onClick={deletingEmployeeHandler}>No</button>
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