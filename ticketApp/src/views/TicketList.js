import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import TicketItemList from "../components/tickets/TicketItemList";
import AuthContext from "../components/context/AuthContext";
import FilterBar from "../components/tickets/FilterBar";
import UserLabel from "../components/shared/UserLabel";
import { useContext, useState } from "react";
import useApiOrigin from "../hooks/useApiOrigin";
import { Redirect } from "react-router-dom";

const TicketList = ({ hasAuth }) => {
    const { token, userId : currentUserID } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const queryClient = useQueryClient();
    let { teamId, userId } = useParams();
    if(userId === undefined) {
        userId = currentUserID;
    }

    const [filters, setFilters] = useState(new URLSearchParams(window.location.search));
    const { isLoading, error, data } = useQuery(['ticketList', filters.toString()], () => {
        return fetch(`${apiOrigin}/user/${userId}/tickets?${filters.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            return res.json()
        })
    }
    )

    if(!hasAuth) {
        return <Redirect to="/login?goto=/tickets" />
    }

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(data.error) {
        return data.error
    }

    const onFilterChange = (selectedFilters) => {
        setFilters(selectedFilters);
        queryClient.invalidateQueries(['ticketList', filters.toString()]);
    }

    let ticketData = data.data;
    return <div className="container">
        <h1 className="title">
          Tickets for { teamId ? 'team ' + teamId : 'all teams' } for { userId ? <UserLabel userId={userId} /> : 'all users' }
        </h1>
        <FilterBar onChange={onFilterChange} />
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