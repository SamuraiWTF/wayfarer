import { useState } from 'react';

const ChangeRoleModal = ({ member, roles, team, onClickClose, onClickSave }) => {
    const [selectedRole, setSelectedRole] = useState(member.role)

    return <div class="modal-card">
        <header class="modal-card-head">
        <p class="modal-card-title">Change User Role</p>
        <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
            Change user role for { member.name } within team { team }.
            <div className="select">
                <select value={ selectedRole } onChange={(e) => { setSelectedRole(e.target.value) }}>
                    { roles.map(role => <option value={role}>{role}</option>)}
                </select>
            </div>
        </section>
        <footer class="modal-card-foot">
        <button class="button is-success" onClick={onClickSave}>Save changes</button>
        <button class="button" onClick={onClickClose}>Cancel</button>
        </footer>
    </div>
}

export default ChangeRoleModal;