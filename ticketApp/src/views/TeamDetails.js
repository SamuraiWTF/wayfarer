import { useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import AuthContext from "../components/context/AuthContext";
import { useContext, useState } from "react";
import TeamLabel from '../components/shared/TeamLabel';
import TicketStats from '../components/teams/TicketStats';
import TeamMemberList from '../components/teams/TeamMemberList';
import ChangeRoleModal from '../components/teams/ChangeRoleModal';

const TeamDetails = () => {
    // Context 
    const { token, clearAuth } = useContext(AuthContext);

    // Hooks
    const { teamId } = useParams();
    const [currentAction, setCurrentAction] = useState('none')
    const [ actionTarget, setActionTarget ] = useState()

    // Data Queries
    const { isLoading, error, data } = useQuery(['teamDetails', teamId],
        () => fetch(`http://localhost:3001/team/${teamId}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
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

    if (data.reauth) {
        return <p>Auth expired.</p>
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


    // Main Render

    return (
        <div className="container mt-4">
            <div className={`modal ${currentAction !== 'none' ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => { setCurrentAction('none') }}></div>
                { currentAction === 'change_role' ? /* Todo modify filter so Admins get the full list */
                    <ChangeRoleModal member={actionTarget} roles={roleList.slice(roleList.indexOf(data.data.role))} onClickClose={() => { setCurrentAction('none') }} /> : ''
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
                        <TeamMemberList data={data.data.members} onAction={handleMemberAction} />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TeamDetails;