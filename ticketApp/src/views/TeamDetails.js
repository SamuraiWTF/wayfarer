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
import AddMemberModal from '../components/teams/AddMemberModal';
import { Redirect } from 'react-router-dom';

const TeamDetails = ({ hasAuth }) => {
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
                console.log(data);
                if (data.reauth)
                    clearAuth()
            }
        })

    // Auth Check
    if(!hasAuth) {
        return <Redirect to={`/login?goto=${window.location.pathname}`} />
    }
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

    const addMember = (member, selectedRole) => {
        console.log("member: ", member)
        console.log("role: ", selectedRole)
        fetch(`${apiOrigin}/team/${teamId}/add/${member}`, {
            method: 'POST',
            body: JSON.stringify({ teamId: teamId,
                userId: member,
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
                { currentAction === 'add' ? /* Todo modify filter so Admins get the full list */
                    <AddMemberModal team={data.data.name} roles={roleList} onClickConfirm={addMember} onClickClose={() => { setCurrentAction('none') }} /> : ''
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
                        <button className="button is-primary fa-align-center" onClick={() => {setCurrentAction('add')}}>Add new user</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TeamDetails;