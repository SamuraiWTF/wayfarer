import { useQuery } from 'react-query'
import AuthContext from '../../components/context/AuthContext';
import { useContext } from 'react';
import useApiOrigin from "../../hooks/useApiOrigin";

const UserList = ({ teamId, value, assigneeValue, setAssignee, placeholderText, onChange }) => {
    const { token } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const { isLoading, error, data } = useQuery(['teamMembers', teamId], () => 
        fetch(`${apiOrigin}/team/${teamId}`, { headers: { 'Authorization' : `Bearer ${token}`}}).then(res => { return res.json() })
    )

    const handleChange = (member) => {
        onChange('assigned_to', member.user_id, setAssignee);
    }

    if(teamId === undefined || isLoading) {
        return (
            <div className="select is-loading">
                <select>
                        <option value={assigneeValue}>{ placeholderText || 'loading' }</option>
                </select>
            </div>
        )
    }

    if(error) {
        return (
            <div className="select">
                <select disabled>
                        <option value={assigneeValue}>Error Loading</option>
                </select>
            </div>
        )
    }


    if(data) {
        let usersOptions;
        if (data.data) usersOptions = [{ user_id: -1, name: 'Unassigned' } , ...data.data.members];
        return (
            <div className="dropdown is-hoverable pb-2">
                <div className="dropdown-trigger">
                    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>{ data.data ? usersOptions.find(member => member.user_id === assigneeValue)?.name : 'Select a user' }</span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        { data.data ? data.data.members.map(member => <span style={{cursor: 'pointer'}} key={member.user_id} value={member.user_id} className="navbar-item" onClick={() => {handleChange(member)}}>{member.name}</span>) : <></>}
                    </div>
                </div>
            </div>
        )
    }
}

export default UserList;