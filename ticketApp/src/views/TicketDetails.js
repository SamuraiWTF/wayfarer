import { Redirect, useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from "react-query";
import AuthContext from "../components/context/AuthContext";
import { useContext, useState } from "react";
import useApiOrigin from "../hooks/useApiOrigin";
import MessageBox from "../components/shared/MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MDEditor from "../components/tickets/MdEditor";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import * as Showdown from "showdown";
import TeamLabel from "../components/shared/TeamLabel";
import AssigneeSelect from "../components/tickets/AssigneeSelect";
import StatusSelect from '../components/tickets/StatusSelect';


const TicketDetails = ({ hasAuth }) => {
    const { token, clearAuth } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    const queryClient = useQueryClient();
    const [editingName, setEditingName] = useState(false);
    const [editingDesc, setEditingDesc] = useState(false);

    let { ticketId } = useParams();
    const { isLoading, error, data } = useQuery(['ticket', ticketId], () =>
        fetch(`${apiOrigin}/ticket/${ticketId}/`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        })
    )

    const doUpdateTicketFields = useMutation(updatedFields => fetch(`${apiOrigin}/ticket/${ticketId}`, {
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

    if(!hasAuth) {
        return <Redirect to={`/login?goto=${window.location.pathname}`} />
    }

    if (isLoading) { return 'Loading...' } 
    if (error) { return 'An error has occurred: ' + error.message } 
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
    const updateDesc = (newVal) => {
        doUpdateTicketFields.mutate({ body: newVal })
        setEditingDesc(false)
    }
  
    const mdConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

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
                        <h1 className="title">{ ticket.title } <FontAwesomeIcon className="is-clickable" icon={faEdit} onClick={(e) => {setEditingName(true)}} /></h1>
                    }
                </div>
            </div>
            <div className="columns is-1">
                <div className="column is-three-quarters">
                    { message.type.toUpperCase() === 'HIDDEN' ? '' : 
                        <MessageBox onDismiss={() => { console.log('dismiss not implemented' )}} {...message} />
                    }
                    <div className="section has-text-left-desktop">
                        <h2 className="subtitle">description { editingDesc ? '' : <FontAwesomeIcon className="is-clickable" icon={faEdit} onClick={() => { setEditingDesc(true) }} />}</h2>
                        <div className="container has-text-left-desktop">
                        { 
                            editingDesc ? 
                                <MDEditor defaultValue={ticket.body} onSave={updateDesc} onCancel={() => { setEditingDesc(false) }} />
                            :   <div dangerouslySetInnerHTML={{ __html: mdConverter.makeHtml(ticket.body) }}></div> 
                        }
                         
                        </div>
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
                                <TeamLabel teamId={ticket.team_id} />
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