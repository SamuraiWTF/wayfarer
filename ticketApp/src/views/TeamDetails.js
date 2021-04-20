import { useParams } from 'react-router-dom';

const TeamDetails = () => {
    let { teamId } = useParams();

    return () => {
        <div>Details for team { teamId }</div>
    }
}

export default TeamDetails;