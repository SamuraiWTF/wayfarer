import React, { useState, useContext } from "react";
import AuthContext from "../components/context/AuthContext";

const Login = () => {
    const { statusChanged } = useContext(AuthContext);
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
            if (res.error) {
                alert(res.error);
            } else {
                localStorage.setItem('currentUserId', res.data.userId);
                localStorage.setItem('authToken', res.data.token);
                statusChanged();
            }
        })
    }

    return (<div className="modal is-active">
        <div className="box has-background-primary">
            <div className="container is-flex pb-6" style={{justifyContent:'center'}}>
            <figure className="image is-128x128">
                <img src="/wayfarer_tf_icon.svg" alt="wayfarer training federation logo" />
            </figure>
            </div>
            {/** login form */}
            <div className="field is-horizontal">
                <div className="field-label is-large">
                    <label className="label has-text-primary-light">Username</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <p className="control">
                            <input className="input is-large" type="username" placeholder="user@wayfarertf.test" value={username} onChange={event => setUsername(event.target.value)} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <div className="field-label is-large">
                    <label className="label has-text-primary-light">Password</label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <p className="control">
                            <input className="input is-large" type="password" placeholder="***********" value={password} onChange={event => setPassword(event.target.value)} />
                        </p>
                    </div>
                </div>
            </div>
            <button className="button is-link" onClick={handleLogin}>Login</button>
        </div>
    </div>
    )
}

export default Login;