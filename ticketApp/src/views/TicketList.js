import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import useQueryParams from "../hooks/useQueryParams";
import TicketItemList from "../components/tickets/TicketItemList";
import AuthContext from "../components/context/AuthContext";
import FilterBar from "../components/tickets/FilterBar";
import UserLabel from "../components/shared/UserLabel";
import { useContext } from "react";

const TicketList = () => {
    const { token, userId : currentUserID } = useContext(AuthContext);
    let { teamId, userId } = useParams();
    if(userId === undefined) {
        userId = currentUserID;
    }
    let filters = useQueryParams();
    const { isLoading, error, data } = useQuery('ticketList', () =>
        fetch(`http://localhost:3001/user/${userId}/tickets`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            return res.json()
        })
    )

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(data.error) {
        return data.error
    }

    let ticketData = data.data;
    return <div className="container">
        <h1 className="title">
          Tickets for { teamId ? 'team ' + teamId : 'all teams' } for { userId ? <UserLabel userId={userId} /> : 'all users' }
        </h1>
        <FilterBar />
        <ul>
           { filters.get('group') ? <li>Group: {filters.get('group')}</li> : <></> }             
        </ul>
        { ticketData.length > 0 ? 
            <TicketItemList data={ticketData} showTeam={ teamId ? false : true} />
            :
            <h2>No tickets found.</h2>
        }
    </div>
}

export default TicketList;