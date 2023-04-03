import React from 'react';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            message: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    }

    handleLogin(event) {
        event.preventDefault();
        if (this.state.username === 'admin' && this.state.password === 'password') {
            this.setState({
                message: 'Success',
            });
        } else {
            this.setState({
                message: 'Wrong Password',
            });
        }
    }

    render() {
        return (
            <div>
                <h1>Login Page</h1>
                <form onSubmit={this.handleLogin}>
                    <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        placeholder="Password"
                    />
                    <button type="submit">Log In</button>
                </form>
                <button>Create Account</button>
                <p>{this.state.message}</p>
            </div>
        );
    }
}