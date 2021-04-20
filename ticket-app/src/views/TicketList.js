import { useParams, useLocation } from "react-router-dom";
import TicketItemList from "../components/tickets/TicketItemList";

const TicketList = () => {
    let { teamId, userId } = useParams();
    let query = new URLSearchParams(useLocation().search);
    let data = [];

    return <div className="container">
        <h1 className="title">
          Tickets for { teamId ? 'team ' + teamId : 'all teams' } for { userId ? 'user ' + userId : 'all users' }
        </h1>
        { data.length > 0 ? 
            <TicketItemList data={[]} showTeam={ teamId ? false : true} />
            :
            <h2>No tickets found.</h2>
        }
    </div>
}

export default TicketList;