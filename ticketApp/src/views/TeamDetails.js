import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from "react-query";
import AuthContext from "../components/context/AuthContext";
import { useContext, useState } from "react";
import useApiOrigin from "../hooks/useApiOrigin";
import TeamLabel from '../components/shared/TeamLabel';
import TicketStats from '../components/teams/TicketStats';
import TeamMemberList from '../components/teams/TeamMemberList';
import ChangeRoleModal from '../components/teams/ChangeRoleModal';
import RemoveMemberModal from '../components/teams/RemoveMemberModal';

const TeamDetails = () => {
    // Context 
    const { token, clearAuth } = useContext(AuthContext);

    // Hooks
    const apiOrigin = useApiOrigin();
    const { teamId } = useParams();
    const [currentAction, setCurrentAction] = useState('none')
    const [ actionTarget, setActionTarget ] = useState()

    // Data Queries
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery(['teamDetails', teamId],
        () => fetch(`${apiOrigin}/team/${teamId}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
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

    // Constants
    const roleList = ['owner', 'manager', 'member']

    // Event Handles
    const handleStatsClick = (type) => {
        // TODO: Navigate user to Tickets filtering on team and type-specific criteria.
        alert('clicked stats: ' + type)
    }

    const handleMemberAction = (action, member) => {
        setCurrentAction(action);
        setActionTarget(member);
    }

    const changeRole = (member, selectedRole) => {
        fetch(`${apiOrigin}/team/${teamId}/update/${member.user_id}`, {
            method: 'PATCH',
            body: JSON.stringify({ teamId: teamId,
                userId: member.user_id,
                role: selectedRole
                 }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.error) {
                alert(res.error);
            } else {
                queryClient.invalidateQueries(['teamDetails', teamId]);
                setCurrentAction('none');
            }
        })
    }

    const removeMember = (member) => {
        fetch(`${apiOrigin}/team/${teamId}/delete/${member.user_id}`, {
            method: 'DELETE',

            body: JSON.stringify({ teamId: teamId,
                userId: member.user_id,
                 }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.error) {
                alert(res.error);
            } else {
                queryClient.invalidateQueries(['teamDetails', teamId]);
                setCurrentAction('none');
            }
        })
    }

    // Main Render
    return (
        <div className="container mt-4">
            <div className={`modal ${currentAction !== 'none' ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => { setCurrentAction('none') }}></div>
                { currentAction === 'change_role' ? /* Todo modify filter so Admins get the full list */
                    <ChangeRoleModal member={actionTarget} roles={roleList.slice(roleList.indexOf(data.data.role))} onClickSave={changeRole} onClickClose={() => { setCurrentAction('none') }} /> : ''
                }
                { currentAction === 'remove' ? /* Todo modify filter so Admins get the full list */
                    <RemoveMemberModal member={actionTarget} team={data.data.name} onClickConfirm={removeMember} onClickClose={() => { setCurrentAction('none') }} /> : ''
                }
            </div>
            <h1 className="title">Team: <TeamLabel teamId={teamId} /></h1>
            <div className="content">
                <div className="columns">
                    <div className="column">
                        <h2 className="subtitle">Tickets</h2>
                        <div className="content">
                            <TicketStats data={data.data.stats} onClick={handleStatsClick} />
                        </div>
                    </div>
                    <div className="column">
                        <h2 className="subtitle">Members</h2>
                        <TeamMemberList data={data.data.members} userRole={data.data.role} onAction={handleMemberAction} />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TeamDetails;