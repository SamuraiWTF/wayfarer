import { useQuery } from 'react-query';
import AuthContext from "../context/AuthContext";
import { useContext } from 'react';
import useApiOrigin from "../../hooks/useApiOrigin";

const TeamLabel = ({ teamId }) => {
    const { token, clearAuth } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();

    const { isLoading, error, data } = useQuery(['team', teamId], () =>
        fetch(`${apiOrigin}/team/${teamId}/`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
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