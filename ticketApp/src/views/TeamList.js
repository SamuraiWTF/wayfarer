import { useParams, Link } from "react-router-dom";
import AuthContext from "../components/context/AuthContext";
import { useContext } from "react";
import { useQuery } from 'react-query';

const TeamList = () => {
    const { token, userId: currentUser } = useContext(AuthContext);
    let { userId } = useParams();
    let targetId = userId ? userId : currentUser;

    const { isLoading, error, data } = useQuery(['teamsByUser', targetId], () =>
    fetch(`http://localhost:3001/user/${targetId}/teams`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
        return res.json()
    })
)
    
    if(isLoading) {
        return <div>Loading...</div>
    }
    if(error) {
        return <div>Error loading teams.. {error}</div>
    }
    const teams = data?.data;

    return (<>
       <div className="container"><table className="table">
           <thead>
               <tr>
                   <th>Team</th>
                   <th>User Open Tickets</th>
                   <th>Total Open</th>
                   <th>Total Closed</th>
                   <th>Your Role</th>
               </tr>
           </thead>
           <tbody>
        { teams.map(team => 
            <tr key={team.id}>
            <td><Link to={`/team/${team.id}`}>{team.name}</Link></td>
            <td><Link to={`/team/${team.id}/tickets?assigned_to=${targetId}&status=open`}>{team.user_tickets}</Link></td>
            <td><Link to={`/team/${team.id}/tickets?status=open`}>{team.open_tickets}</Link></td>
            <td><Link to={`/team/${team.id}/tickets?status=closed`}>{team.closed_tickets}</Link></td>
            <td>{team.role}</td>
            </tr>
        ) }  
        </tbody>
        </table></div>
    </>)
}

export default TeamList;