import { useParams } from 'react-router-dom';
import TeamLabel from '../components/shared/TeamLabel';

const TeamMemberList = ({ teamId }) => {
    return <div>List for {teamId}</div>
}

const TicketStats = ({ teamId }) => {
    return <div className="container has-text-center">{
    /* <table><tbody>
        <tr>
            <td className="has-text-weight-semibold">Open</td>
            <td>1</td>
        </tr>
        <tr>
            <td className="has-text-weight-semibold">Unassigned</td>
            <td>1</td>
        </tr>
        <tr>
            <td className="has-text-weight-semibold">Overdue</td>
            <td>0</td>
        </tr>
        <tr>
            <td className="has-text-weight-semibold">Closed</td>
            <td>0</td>
        </tr>    
    </tbody></table> */ }
        <div class="tile is-ancestor">
            <div class="tile is-vertical is-8">
                <div class="tile">
                    <div class="tile is-8 is-parent is-vertical">
                        <article class="tile is-child notification is-link is-clickable">
                            <p class="title">1</p>
                            <p class="subtitle">Open</p>
                        </article>
                        <article class="tile is-child notification is-warning is-clickable">
                            <p class="title">0</p>
                            <p class="subtitle">Unassigned</p>
                        </article>
                    </div>
                    <div class="tile is-8 is-parent is-vertical">
                        <article class="tile is-child notification is-danger is-clickable">
                            <p class="title">2</p>
                            <p class="subtitle">Overdue</p>
                        </article>
                        <article class="tile is-child notification is-info is-clickable">
                            <p class="title">1</p>
                            <p class="subtitle">Closed</p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </div>
}


const TeamDetails = () => {
    let { teamId } = useParams();

    return (
        <div className="container mt-4">
            <h1 className="title"><TeamLabel teamId={teamId} /></h1>
            <div className="content">
                <div className="columns">
                    <div className="column">
                        <h2 className="subtitle">Tickets</h2>
                        <TicketStats teamId={teamId} />
                    </div>
                    <div className="column">
                        <h2 className="subtitle">Members</h2>
                        <TeamMemberList teamId={teamId} />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TeamDetails;