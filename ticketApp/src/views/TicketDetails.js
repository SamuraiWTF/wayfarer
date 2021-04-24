import { useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import AuthContext from "../components/context/AuthContext";
import { useContext } from "react";

const TicketDetails = () => {
    const { token } = useContext(AuthContext);
    let { ticketId } = useParams();
    const { isLoading, error, data } = useQuery(`ticket-${ticketId}`, () =>
        fetch(`http://localhost:3001/ticket/${ticketId}/`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        })
    )

    if (isLoading) { return 'Loading...' } 
    if (error) { return 'An error has occurred: ' + error.message } else 
    if (data.error) { return data.error } 

    const ticket = data.data;

    return (
        <div className="container">
            <div className="hero is-small is-danger is-bold">
                <div className="hero-body">
                    <h1 className="title">{ ticket.title }</h1>
                </div>
            </div>
            <div className="columns is-1">
                <div className="column is-three-quarters">
                    <div className="section has-text-left-desktop">
                        <h2 className="subtitle">description</h2>
                        <div className="container has-text-left-desktop" dangerouslySetInnerHTML={{ __html: ticket.body }}></div>
                    </div>
                    <div className="section has-text-left-desktop">
                        <h2 className="subtitle">comments</h2>
                    </div>
                </div>
                <div className="column is-one-quarter">
                    <div className="section has-text-center">
                        <div className="field">
                            <label className="label">team</label>
                            <div className="control">
                                <span>Help Desk</span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">status</label>
                            <div className="control">
                                <div className="select">
                                    <select defaultValue="open" value={ticket.status}>
                                        <option value="open">open</option>
                                        <option value="closed">closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">assignee</label>
                            <div className="control">
                                <div className="select is-loading">
                                    <select disabled>
                                        <option value="open">Captain Beard</option>
                                        <option value="closed">closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section has-text-center">
                       
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketDetails;