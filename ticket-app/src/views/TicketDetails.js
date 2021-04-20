import { useParams } from 'react-router-dom';

const TicketDetails = () => {
    let { ticketId } = useParams();

    return (
        <div>Details for ticket: { ticketId }</div>
    );
}

export default TicketDetails;