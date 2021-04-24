import { useParams } from "react-router-dom";
import AuthContext from "../components/context/AuthContext";
import { useContext } from "react";

const TeamList = () => {
    const { token, userId: currentUser } = useContext(AuthContext);
    let { userId } = useParams();

    return <div>Team List for user { userId ? userId : currentUser}</div>
}

export default TeamList;