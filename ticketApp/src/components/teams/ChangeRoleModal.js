import { useState } from 'react';

const ChangeRoleModal = ({ member, roles, team, onClickClose, onClickSave }) => {
    const [selectedRole, setSelectedRole] = useState(member.role)

    return <div className="modal-card">
        <header className="modal-card-head">
        <p className="modal-card-title">Change User Role</p>
        <button className="delete" aria-label="close"  onClick={onClickClose}></button>
        </header>
        <section className="modal-card-body">
            Change user role for { member.name } within team { team }.
            <div className="select">
                <select value={ selectedRole } onChange={(e) => { setSelectedRole(e.target.value) }}>
                    { roles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
            </div>
        </section>
        <footer className="modal-card-foot">
        <button className="button is-success" onClick={() => onClickSave(member, selectedRole)}>Save changes</button>
        <button className="button" onClick={onClickClose}>Cancel</button>
        </footer>
    </div>
}

export default ChangeRoleModal;