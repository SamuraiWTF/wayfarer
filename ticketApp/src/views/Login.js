import React, { useState } from "react";

const Login = ({ authStatusChanged }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = () => {
        fetch('http://localhost:3001/authenticate', {
            method: 'post',
            body: JSON.stringify({ 'username': username, 'password': password }),
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if(res.error) {
                alert(res.error);
            } else {
              localStorage.setItem('currentUserId', res.data.userId);
              localStorage.setItem('authToken', res.data.token);
              authStatusChanged();
            }
        })
    }

    return (
        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container has-text-center m-6">
                    <div className="section m-6">
                    <div className="card m-6 p-6">
                    <div className="card-image">
                        <figure className="image is-4by3">
                            <img src="/wayfarer_tf_icon.svg" alt="wayfarer training federation logo" />
                        </figure>
                    </div>
                    <div className="card-content">
                        <div className="content">
                            {/** login form */}
                            <div className="field">
                                <p className="control has-icons-left has-icons-right">
                                    <input className="input" type="username" placeholder="Username" value={username} onChange={ event => setUsername(event.target.value) } />
                                </p>
                                </div>
                                <div className="field">
                                <p className="control has-icons-left">
                                    <input className="input" type="password" placeholder="Password" value={password} onChange={ event => setPassword(event.target.value) } />
                                </p>
                                </div>
                            <button className="button is-primary" onClick={handleLogin}>Login</button>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </section>
    ) 
}

export default Login;