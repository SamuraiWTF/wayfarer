import { useQuery, useMutation } from 'react-query'
import AuthContext from '../../components/context/AuthContext';
import { useContext, useState } from 'react';

const UserList = ({ teamId, value, placeholderText }) => {
    const [assigneeValue, setAssignee] = useState(value || -1)
    const { token } = useContext(AuthContext);
    const { isLoading, error, data } = useQuery(['teamMembers', teamId], () => 
        fetch(`http://localhost:3001/team/${teamId}`, { headers: { 'Authorization' : `Bearer ${token}`}}).then(res => { return res.json() })
    )

    const handleChange = (event) => {
        setAssignee(event.target.value)
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
        return (
            <div className="dropdown is-hoverable pb-2">
                <div className="dropdown-trigger">
                    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>{ data.data ? data.data.members.find(team => team.user_id === assigneeValue)?.name || 'Select a user' : 'Select a user'}</span>
                        <span className="icon is-small">
                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        { data.data ? data.data.members.map(member => <span style={{cursor: 'pointer'}} key={member.user_id} value={member.user_id} className="navbar-item" onClick={() => {setAssignee(member.user_id)}}>{member.name}</span>) : <></>}
                    </div>
                </div>
            </div>
        )
    }
}

export default UserList;