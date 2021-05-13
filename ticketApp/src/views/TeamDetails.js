import { useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import AuthContext from "../components/context/AuthContext";
import { useContext, useState } from "react";
import TeamLabel from '../components/shared/TeamLabel';
import TicketStats from '../components/teams/TicketStats';
import TeamMemberList from '../components/teams/TeamMemberList';

const TeamDetails = () => {
    // Auth context 
    const { token, clearAuth } = useContext(AuthContext);
    
    // Hooks
    let { teamId } = useParams();

    // Data Fetching

    const { isLoading, error, data } = useQuery(['teamDetails', teamId], 
    () => fetch(`http://localhost:3001/team/${teamId}`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => res.json()), 
    { /* options */ })
    
    // Early Renders
    if(isLoading) {
        return <p>Loadings...</p>
    }

    if(error) {
        return <p>Error: {error}</p>
    }

    // Event Handlers

    const handleStatsClick = (type) => {
        // TODO: Navigate user to Tickets filtering on team and type-specific criteria.
        alert('clicked stats: ' + type)
    }

    const handleMemberAction = (action, member) => {
        alert(`Doing ${action} on ${member.name}`)
    }

    return (
        <div className="container mt-4">
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