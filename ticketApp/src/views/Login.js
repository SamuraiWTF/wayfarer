import React, { useState, useContext } from "react";
import useApiOrigin from "../hooks/useApiOrigin";
import AuthContext from "../components/context/AuthContext";
import { Redirect } from "react-router-dom";
import useQueryParams from "../hooks/useQueryParams";

const Login = ({ hasAuth }) => {
    const { statusChanged } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const goto = useQueryParams().get('goto');

    if(hasAuth) {
        return <Redirect to={goto || '/'} />
    }

    const loggedInSince = localStorage.getItem('loggedInSince');
    if(loggedInSince && Date.now() - (30 * 24 * 60 * 60 * 1000) < loggedInSince ) {
        fetch(`${apiOrigin}/auth/refresh`, {
            method: 'GET',
            credentials: 'include'
        }).then((response) => response.json())
        .then((res) => {
            if(res.error) {
                localStorage.removeItem('loggedInSince'); 
                // Failed refresh means the token is missing or invalid. Drop into the normal login flow.
            } else {
                const isAdmin = JSON.parse(atob(res.data.token.split('.')[1])).isAdmin;
                if(isAdmin) {
                    sessionStorage.setItem('isAdmin', isAdmin);
                } else {
                    sessionStorage.removeItem('isAdmin');
                }
                localStorage.setItem('currentUserId', res.data.userId);
                localStorage.setItem('authToken', res.data.token);
                statusChanged();
            }
        })
    }

    const handleLogin = () => {
        fetch(`${apiOrigin}/authenticate`, {
            method: 'POST',
            body: JSON.stringify({ 'username': username, 'password': password, 'stayLoggedIn': stayLoggedIn }),
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.error) {
                alert(res.error);
            } else {
                const isAdmin = JSON.parse(atob(res.data.token.split('.')[1])).isAdmin;
                if(isAdmin) {
                    sessionStorage.setItem('isAdmin', isAdmin);
                } else {
                    sessionStorage.removeItem('isAdmin');
                }
                if(stayLoggedIn) {
                    localStorage.setItem('loggedInSince', Date.now());
                }
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
            <div className="field is-horizontal">
                <label className="checkbox has-text-primary-light">
                    <input type="checkbox" checked={stayLoggedIn} onChange={() => setStayLoggedIn(!stayLoggedIn)} />
                    Stay Logged In
                </label>
            </div>
            <div className="field is-horizontal">
                <label className="has-text-primary-light is-small">
                { stayLoggedIn ? `Don't use this option on shared devices.` : ''}
                </label>
            </div>
            <button className="button is-link" onClick={handleLogin}>Login</button>
        </div>
    </div>
    )
}

export default Login;