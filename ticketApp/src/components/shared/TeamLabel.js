import { useQuery } from 'react-query';
import AuthContext from "../context/AuthContext";
import { useContext } from 'react';

const TeamLabel = ({ teamId }) => {
    const { token, clearAuth } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery(['team', teamId], () =>
        fetch(`http://localhost:3001/team/${teamId}/`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        }),
        {
            onSettled: (data) => {
                if(data.reauth)
                    clearAuth()
            }
        }
    )

    if(isLoading || teamId === undefined) {
        return <span>Team {teamId}</span>
    }
    if(error) {
        console.log('Error ', error);
        return <span>Error resolving {teamId}</span>
    }
    if(data.reauth) {
        return <span>Session Expired</span>
    }
    let team = data.data;
    return <span>{team.name}</span>
}

export default TeamLabel;