import { useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import TeamLabel from '../components/shared/TeamLabel';
import TicketStats from '../components/teams/TicketStats';
import TeamMemberList from '../components/teams/TeamMemberList';

const TeamDetails = () => {
    // Hooks
    let { teamId } = useParams();

    // Data Fetching

    const { isLoading, error, data } = useQuery(['teamTicketStats', teamId], 
    () => { /* fetch */}, 
    { /* options */ })
    const mockData = {
        id: 1,
        name: "Help Desk",
        role: "owner", // ["none", "member", "manager", "owner", "admin"] -- used for setting UI
        members: [
            { 
                user_id: 3,
                name: "John the Cook",
                role: "member",
                open_tickets: 2
            },
            {
                user_id: 2,
                name: "Quartermaster Sam",
                role: "owner",
                open_tickets: 0
            }
        ],
        stats: {
            open: 2,
            closed: 5,
            unassigned: 3,
            overdue: 0
        }
    }
    
    // Early Renders


    // Event Handlers

    const handleStatsClick = (type) => {
        // TODO: Navigate user to Tickets filtering on team and type-specific criteria.
        alert('clicked stats: ' + type)
    }

    return (
        <div className="container mt-4">
            <h1 className="title">Team: <TeamLabel teamId={teamId} /></h1>
            <div className="content">
                <div className="columns">
                    <div className="column">
                        <h2 className="subtitle">Tickets</h2>
                        <div className="content">
                        <TicketStats data={mockData.stats} onClick={handleStatsClick} />
                        </div>
                    </div>
                    <div className="column">
                        <h2 className="subtitle">Members</h2>
                        <TeamMemberList data={mockData.members} />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TeamDetails;