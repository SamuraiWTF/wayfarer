import { useParams } from "react-router-dom";

const TeamList = () => {
    let { userId } = useParams();
    let currentUser = localStorage.getItem('userId');

    return <div>Team List for user { userId ? userId : currentUser}</div>
}

export default TeamList;