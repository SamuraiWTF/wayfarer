import React, { useState, useContext, useEffect } from "react";
import useApiOrigin from "../hooks/useApiOrigin";
import useOAuthOrigin from "../hooks/useOAuthOrigin";
import AuthContext from "../components/context/AuthContext";
import { Redirect } from "react-router-dom";
import useQueryParams from "../hooks/useQueryParams";

const Login = ({ hasAuth }) => {
    const { statusChanged } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const oauthOrigin = useOAuthOrigin();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [consenting, setConsenting] = useState(false);
    const goto = useQueryParams().get('goto');

    const clientId = 'wayfarer';

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
                const isAdmin = JSON.parse(atob(res.token.split('.')[1])).isAdmin;
                if(isAdmin) {
                    sessionStorage.setItem('isAdmin', isAdmin);
                } else {
                    sessionStorage.removeItem('isAdmin');
                }
                localStorage.setItem('currentUserId', res.userId);
                setConsenting(true);
            }
        })
    }

    const handleLogin = () => {
        fetch(`${apiOrigin}/authenticate`, {
            method: 'POST',
            credentials: 'include',
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
                setConsenting(true);
            }
        })
    }

    const getAuthCode = () => {
        const userId = localStorage.getItem('currentUserId');
        fetch(`${oauthOrigin}/authenticate?userId=${userId}&clientId=${clientId}`).then(res => res.json()).then(res => {
            if (res.error) {
                alert(res.error);
                setConsenting(false);
            } else {
                if (!res.data) newAuthCode();
                else if (res.expiresAt < Math.round(Date.now() / 1000)) updateAuthCode();
                else getToken(res.data);
            }
        });
    }

    const newAuthCode = () => {
        const userId = localStorage.getItem('currentUserId');
        fetch(`${oauthOrigin}/authenticate/new?userId=${userId}&clientId=${clientId}`).then(res => res.json()).then(res => {
            if (res.error) {
                setConsenting(false);
                alert(res.error);
            } else {
                getToken(res.data);
            }
        });
    }

    const updateAuthCode = () => {
        const userId = localStorage.getItem('currentUserId');
        fetch(`${oauthOrigin}/authenticate/update?userId=${userId}&clientId=${clientId}`).then(res => res.json()).then(res => {
            if (res.error) {
                setConsenting(false);
                alert(res.error);
            } else {
                getToken(res.data);
            }
        });
    }

    const getToken = (code) => {
        const userId = localStorage.getItem('currentUserId');
        const isAdmin = sessionStorage.getItem('isAdmin') ? sessionStorage.getItem('isAdmin') : false;
        fetch(`${oauthOrigin}/token?userId=${userId}&code=${code}&clientId=${clientId}&isAdmin=${isAdmin}`).then(res => res.json()).then(res => {
            if (res.error) {
                setConsenting(false);
                alert(res.error);
            } else {
                localStorage.setItem('authToken', res.data);
                statusChanged();
            }
        });
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
                            <input className="input is-large" type="username" placeholder="user@wayfarertf.test" value={username} onChange={event => setUsername(event.target.value)} disabled={consenting} />
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
                            <input className="input is-large" type="password" placeholder="***********" value={password} onChange={event => setPassword(event.target.value)} disabled={consenting} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="field is-horizontal">
                <label className="checkbox has-text-primary-light">
                    <input type="checkbox" checked={stayLoggedIn} onChange={() => setStayLoggedIn(!stayLoggedIn)} disabled={consenting} />
                    Stay Logged In
                </label>
            </div>
            <div className="field is-horizontal">
                <label className="has-text-primary-light is-small">
                { stayLoggedIn ? `Don't use this option on shared devices.` : ''}
                </label>
            </div>
            <div className="field is-horizontal">
                <label className={"has-text-primary-light is-small" + (consenting ? "" : " is-hidden")}>
                    By confirming below, you are consenting Wayfarer to access your account.
                </label>
            </div>
            <button className={"button is-link" + (consenting ? " is-hidden" : "")} onClick={handleLogin}>Login</button>
            <button className={"button is-link mr-4" + (consenting ? "" : " is-hidden")} onClick={getAuthCode}>Confirm</button>
            <button className={"button is-link ml-4" + (consenting ? "" : " is-hidden")} onClick={() => setConsenting(false)}>Cancel</button>
        </div>
    </div>
    )
}

export default Login;