import { useQuery, useMutation } from 'react-query'
import AuthContext from '../../components/context/AuthContext';
import { useContext, useState } from 'react';
import useApiOrigin from "../../hooks/useApiOrigin";

const AssigneeSelect = ({ teamId, ticketId, value, placeholderText }) => {
    const [assigneeValue, setAssignee] = useState(value || -1)
    const { token } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const { isLoading, error, data } = useQuery(['teamMembers', teamId], () => 
        fetch(`${apiOrigin}/team/${teamId}`, { headers: { 'Authorization' : `Bearer ${token}`}}).then(res => { return res.json() })
    )
    const doUpdate = useMutation(newAssignee => fetch(`${apiOrigin}/ticket/${ticketId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            assigned_to: newAssignee
        })
    }))

    const handleChange = (event) => {
        setAssignee(event.target.value)
        doUpdate.mutate(event.target.value)
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
            <div className={doUpdate.isLoading ? 'select is-loading' : 'select'}>
                <select value={assigneeValue} onChange={handleChange}>
                        { assigneeValue === -1 ? <option value="-1">Unassigned</option> : '' }
                        { data.data.members.map(member => <option key={member.user_id} value={member.user_id}>{member.name}</option>)}
                </select>
            </div>
        )
    }
}

export default AssigneeSelect