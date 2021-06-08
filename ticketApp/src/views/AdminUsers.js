import { Redirect } from "react-router-dom";
import AuthContext from "../components/context/AuthContext";
import { useContext, useState } from "react";
import useApiOrigin from "../hooks/useApiOrigin";
import { useQuery, useMutation, useQueryClient } from 'react-query';

const AdminUsers = ({ hasAuth }) => {
    const { token } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const [newUser, setNewUser] = useState({name:'', username: '', password: '', isadmin: false})
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery(['admin', 'allUsers'], () =>
    fetch(`${apiOrigin}/admin/users`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
        return res.json()
    })
    );

    const addUser = useMutation(user => fetch(`${apiOrigin}/admin/user/new`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }), { onSuccess: () => {
        queryClient.invalidateQueries(['admin', 'allUsers']);
    }});

    if(isLoading) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div>Error loading. {error}</div>
    }

    if(!hasAuth) {
        return <Redirect to={`/login`} />
    }

    if(data.data) {
        return <div className="content">
            <div className="hero is-primary">
                <h1 className="title">User Administration</h1>
            </div>
            <div className="section">
                <form>
                <h2 className="subtitle">Add User</h2>
                <div className="field is-horizontal">
                    <div className="label field-label">Name</div>
                    <div className="control field-body">
                        <input className="input" type="text" value={newUser.name} onChange={(e) => { setNewUser(Object.assign({}, newUser, { name: e.target.value })) }} placeholder="" />
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="field-label label">Username</div>
                    <div className="field-body control">
                        <input className="input" type="text" value={newUser.username} onChange={(e) => { setNewUser(Object.assign({}, newUser, { username: e.target.value }))}} placeholder="" />
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="label field-label">Password</div>
                    <div className="control field-body">
                        <input className="input" type="password" placeholder="" value={newUser.password} onChange={(e) => { setNewUser(Object.assign({}, newUser, { password: e.target.value }))}} />
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="label field-label">Admin</div>
                    <div className="control field-body">
                    <div className="select">
                        <select value={newUser.isadmin} onChange={(e) => {setNewUser(Object.assign({}, newUser, { isadmin: e.target.value }))}}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div className="field is-horizontal">
                    <div className="label field-label"></div>
                    <div className="control field-body">
                    <button className="button is-primary" onClick={() => { addUser.mutate(newUser) }}>
                        Add
                    </button>
                    </div>
                </div>
                </form>
            </div>
            <div className="section">
                <h2 className="subtitle">Users</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>username</th>
                        <th>admin</th>
                    </tr>
                </thead>
                <tbody>
                    { data.data.map(user => <tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{user.username}</td><td>{user.isadmin ? 'YES' : 'NO'}</td></tr>)}
                </tbody>
            </table>
        </div></div>
    }
}

export default AdminUsers;