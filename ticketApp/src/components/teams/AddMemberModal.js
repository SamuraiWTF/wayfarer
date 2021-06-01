import { useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import AuthContext from "../context/AuthContext";
import { useContext, useState } from 'react';
import useApiOrigin from "../../hooks/useApiOrigin";

const AddMemberModal = ({ roles, team, onClickClose, onClickConfirm }) => {
    const { token, clearAuth } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const { teamId } = useParams();
    const selections = new URLSearchParams(window.location.search);
    const [selectedUser, setSelectedUser] = useState(selections.get('user') || 'Select a user')
    const [selectedRole, setSelectedRole] = useState(selections.get('role') || 'Selelct a role')
    const [btnActive, setBtnActive] = useState(false);

    const { isLoading, error, data } = useQuery(['absentUsers', teamId],
        () => fetch(`${apiOrigin}/team/${teamId}/absent`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
        {
            onSettled: (data) => {
                if (data.reauth)
                    clearAuth()
            }
        })

    // Early Renders
    if (isLoading) {
        return <p>Loadings...</p>
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    if (data.error) {
        if(data.reauth) {
            console.log('Session timed out, clearing auth');
            clearAuth();
        } 
        return data.error;
    }

    const users = data.data;
    const usersOptions = [{ id: -1, name: 'Select a user' }, ...users];
    const rolesOptions = [{ id: -1, name: 'Select a role' }, ...roles.map((role, index) => {return { id: index, name: role }})];

    const changeFilters = (key, value, setter) => {
        if(value === -1) {
            selections.delete(key)
        } else {
            selections.set(key, value); 
        }
        setter(value); 
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + selections.toString();
        window.history.pushState({path: newurl}, '', newurl);
        if (selections.get('user') && selections.get('role')) {
            setBtnActive(true);
        } else {
            setBtnActive(false);
        }
    }

    return <div className="modal-card">
        <header className="modal-card-head">
        <p className="modal-card-title">Add User to { team }</p>
        <button className="delete" aria-label="close"  onClick={() => {
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({path: newurl}, '', newurl);
            onClickClose();}}></button>
        </header>
        <section className="modal-card-body">
            Select a user and role to add to { team }.
            <div className="select">
                <select value={ usersOptions.find(user => user.id == selectedUser)?.name } onChange={(e) => { changeFilters('user', usersOptions.find(user => user.name == e.target.value)?.id, setSelectedUser) }}>
                    { usersOptions.filter(val => val != selectedUser).map(user => <option key={`user-${user.name}`} value={user.name}>{user.name}</option>)}
                </select>
            </div>
            <div className="select">
                <select value={ rolesOptions.find(role => role.id == selectedRole)?.name } onChange={(e) => { changeFilters('role', rolesOptions.find(role => role.name == e.target.value)?.id, setSelectedRole) }}>
                    { rolesOptions.filter(val => val != selectedRole).map(role => <option key={`role-${role.name}`} value={role.name}>{role.name}</option>)}
                </select>
            </div>
        </section>
        <footer className="modal-card-foot">
        <button className="button is-success" disabled={!btnActive} onClick={() => onClickConfirm(selections.get('user'), rolesOptions.find(role => role.id == selectedRole)?.name)}>Confirm user</button>
        <button className="button" onClick={() => {
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({path: newurl}, '', newurl);
            onClickClose();}}>Cancel</button>
        </footer>
    </div>
}

export default AddMemberModal;