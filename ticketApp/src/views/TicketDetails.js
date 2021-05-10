import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from "react-query";
import AuthContext from "../components/context/AuthContext";
import { useContext, useState } from "react";
import MessageBox from "../components/shared/MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import AssigneeSelect from "../components/tickets/AssigneeSelect";
import StatusSelect from '../components/tickets/StatusSelect';

const TicketDetails = () => {
    const { token, clearAuth } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [editingName, setEditingName] = useState(false);
    const [editingDesc, setEditingDesc] = useState(false);
    let { ticketId } = useParams();
    const { isLoading, error, data } = useQuery(['ticket', ticketId], () =>
        fetch(`http://localhost:3001/ticket/${ticketId}/`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        })
    )

    const doUpdateTicketFields = useMutation(updatedFields => fetch(`http://localhost:3001/ticket/${ticketId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
    }), { onSuccess: () => {
        queryClient.invalidateQueries(['ticket', ticketId]);
    }})

    const [message, setMessage] = useState({type: 'HIDDEN', msg: 'There is no message'})

    if (isLoading) { return 'Loading...' } 
    if (error) { return 'An error has occurred: ' + error.message } else 
    if (data.error) {
        if(data.reauth) {
            console.log('Session timed out, clearing auth');
            clearAuth();
        } 
        return data.error;
    } 

    const ticket = data.data;
    const updateTitle = (e) => {
        //DOM traversal to do this is a terrible solution, but a time-saver.
        let value = e.target.parentElement.parentElement.firstElementChild.firstElementChild.value
        doUpdateTicketFields.mutate({ title: value })
        setEditingName(false)
    }
  

    return (
        <div className="container">
            <div className="hero is-small is-danger is-bold">
                <div className="hero-body">
                    { 
                        editingName ? 
                            <h1 className="title">
                                <div className="field has-addons">
                                    <div className="control is-expanded">
                                        <input className="input is-large" type="text" defaultValue={ticket.title} />    
                                    </div>
                                    <div className="control">
                                            <button className="button is-link is-large" onClick={updateTitle}>Save
                                            </button>
                                    </div>
                                    <div className="control">
                                            <button className="button is-primary is-large" onClick={() => setEditingName(false)}>Cancel
                                            </button>
                                    </div>
                                </div>
                            </h1>
                        :
                        <h1 className="title">{ ticket.title } <FontAwesomeIcon icon={faEdit} onClick={(e) => {setEditingName(true)}} /></h1>
                    }
                </div>
            </div>
            <div className="columns is-1">
                <div className="column is-three-quarters">
                    { message.type.toUpperCase() === 'HIDDEN' ? '' : 
                        <MessageBox onDismiss={() => { console.log('dismiss not implemented' )}} {...message} />
                    }
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
                                <StatusSelect value={ticket.status} onChange={(e) => { doUpdateTicketFields.mutate({ status: e.target.value })}} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">assignee</label>
                            <div className="control">
                                <AssigneeSelect value={ticket.assigned_to} teamId={ticket.team_id} ticketId={ticket.id} />
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