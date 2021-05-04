import { useParams } from "react-router-dom";
import AuthContext from "../components/context/AuthContext";
import { useContext } from "react";
import { useQuery } from 'react-query';

const TeamList = () => {
    console.log('mounting teamList');
    const { token, userId: currentUser } = useContext(AuthContext);
    let { userId } = useParams();
    let targetId = userId ? userId : currentUser;
    console.log('targetId', targetId);
    
    return (<>
       <div>Not implemented. Token { token }</div>
    </>)
}

export default TeamList;