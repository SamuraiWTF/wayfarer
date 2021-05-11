import { useQuery } from 'react-query';
import AuthContext from "../context/AuthContext";
import { useContext } from 'react';

const TeamLabel = ({ teamId }) => {
    const { token } = useContext(AuthContext);
    /*const { isLoading, error, data } = useQuery(['team', teamId], () =>
    fetch(`http://localhost:3001/team/${teamId}`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
        return res.json()
    }))*/
    const { isLoading, error, data } = useQuery(['team', teamId], () =>
        fetch(`http://localhost:3001/team/${teamId}/`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        })
    )

    if(isLoading) {
        return <span>{teamId}</span>
    }
    if(error) {
        console.log('Error ', error);
        return <span>Error resolving {teamId}</span>
    }
    let team = data.data;
    return <span>{team.name}</span>
}

export default TeamLabel;