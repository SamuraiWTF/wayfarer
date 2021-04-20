import { useParams } from "react-router-dom";

const TeamList = () => {
    let { userId } = useParams();

    return <div>Team List for { userId ? 'user ' + userId : 'current user'}</div>
}

export default TeamList;