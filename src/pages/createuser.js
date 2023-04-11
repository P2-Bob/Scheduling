
const createuserHandler = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/createUser', {
        method: 'POST',
        body: JSON.stringify({
            username: event.target.username.value,
            password: event.target.password.value,
            name: event.target.name.value,
            role: event.target.role.value,
            age: event.target.age.value,
            department: event.target.department.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log(data);
}

export default function createuser() {
    return (
        <div>
            <h1>Create User Page</h1>
            <form onSubmit={createuserHandler}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                />
                <input
                    type="text"
                    name="initials"
                    placeholder="Initials"
                    required
                />
                <input
                    type="text"
                    name="role"
                    placeholder="Role"
                    required
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    required
                />
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    required
                />
                <button type="submit">Create User</button>
            </form>
      </div>
  )
}