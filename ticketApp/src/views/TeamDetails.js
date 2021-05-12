import { useParams, Link } from 'react-router-dom';
import { useQuery } from "react-query";
import TeamLabel from '../components/shared/TeamLabel';
import TicketStats from '../components/teams/TicketStats';


const TeamMemberCard = ({ data: person, editable, removable, onAction }) => {
    const colors = {
        owner: {
            bgclass: 'has-background-dark',
            txtclass: 'has-text-light'
        },
        manager: {
            bgclass: 'has-background-info',
            txtclass: 'has-text-info-light'
        },
        member: {
            bgclass: 'has-background-link',
            txtclass: 'has-text-dark'
        }
    }
    const bgcolor = colors[person.role].bgclass;
    const txtcolor = colors[person.role].txtclass;
    return (
        <div className={`card ${bgcolor} mb-5`}>
            <div className={`card-content ${bgcolor}`}>
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-48x48" style={{backgroundColor: 'white'}}>
                            <img src="/avatar.png" alt="Placeholder avatar" style={{height:'48px'}} />
                        </figure>
                    </div>
                    <div className="media-content">
                        <p className={`title is-4 ${txtcolor}`}><Link className={txtcolor} to={`/user/${person.user_id}`}>{person.name}</Link></p>
                        <p className={`subtitle is-6 ${txtcolor}`}>{person.role}</p>
                    </div>
                </div>
                <div className={`content ${txtcolor}`}>
                    { person.open_tickets } open tickets.
                </div>
            </div>
            <footer className="card-footer">
                {
                    (editable && person.role !== 'owner') ? 
                    <span className="card-footer-item is-clickable has-background-warning" onClick={() => { onAction('change_role', person)}}>Change Role</span> 
                    : ''
                }
                {
                    (removable && person.role !== 'owner') ?
                    <span className="card-footer-item is-clickable has-background-danger has-text-light" onClick={() => { onAction('remove', person)}}>Remove</span>
                    : ''
                }
            </footer>
        </div>
    )
}

const TeamMemberList = ({ data: members }) => {
    const sorter = (() => { 
        const order = ['owner', 'manager', 'member']; 
        return (a,b) => order.indexOf(a.role) - order.indexOf(b.role) || (a.name > b.name ? 1 : -1)
    })()

    return <ul style={{listStyle: 'none'}}>
        { members.sort(sorter).map(member => <li><TeamMemberCard data={member} editable={true} removable={true} /></li>) }
    </ul>
}


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