import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState } from "react";
import AuthContext from "../components/context/AuthContext";
import { useContext } from "react";
import useApiOrigin from "../hooks/useApiOrigin";
import UserList from "../components/tickets/UserList";

const CreateTicket = () => {
    const { token, userId: currentUser } = useContext(AuthContext);
    const apiOrigin = useApiOrigin();
    let { userId } = useParams();
    let targetId = userId ? userId : currentUser;
    const selectedFilters = new URLSearchParams(window.location.search);
    const [filterTeam, setFilterTeam] = useState(selectedFilters.get('team') || -1);
    const [filterAssignedTo, setFilterAssignedTo] = useState(selectedFilters.get('assigned_to') || -1);
    const { isLoading, error, data } = useQuery('filterOptions', () => 
        fetch(`${apiOrigin}/options/filtering`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        }),
        {
            onError: (err) => {
                console.log('query error ', err)
            }
        }
    )

    const [btnActive, setBtnActive] = useState(false);
    const onChange = () => {
        if (selectedFilters.get('team')
        && document.getElementById("ticketTitle").value
        && document.getElementById("ticketBody").value) {
            setBtnActive(true);
        } else {
            setBtnActive(false);
        }
    }

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(data.error) return data.error

    const { teams } = data.data;
    const teamsOptions = [{ id: -1, name: 'Select a team' } , ...teams];

    const changeFilters = (key, value, setter) => {
        if(value === -1) {
            selectedFilters.delete(key);
        } else {
            selectedFilters.set(key, value);
        }
        setter(value);
        if (key === 'team') {
            selectedFilters.delete('assigned_to');
            setFilterAssignedTo(-1);
        }
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + selectedFilters.toString();
        window.history.pushState({path: newurl}, '', newurl);
        onChange(selectedFilters);
    }

    const submitTicket = () => {
        fetch(`${apiOrigin}/ticket/create`, {
            method: 'post',
            body: JSON.stringify({ title: document.getElementById("ticketTitle").value,
                body: document.getElementById("ticketBody").value,
                teamId: filterTeam,
                assignedTo: filterAssignedTo,
                userId: targetId
                 }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }).then((response) => {
            return response.json();
        }).then((res) => {
            if (res.error) {
                alert(res.error);
            } else {
                alert("Ticket successfully created.");
            }
        })
    }

    return (
        <div className="container mt-4">
            <h1 className="title">Create New Ticket</h1>
            <article className="message is-primary">
                <div className="message-body">
                    <div className="columns has-text-left">
                        <div className="column is-three-fifths">
                            <div className="field">
                                <label className="label">Title</label>
                                <div className="control">
                                    <input className="input" id="ticketTitle" type="text" placeholder="Title" onChange={onChange}/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Message</label>
                                <div className="control">
                                    <textarea className="textarea" id="ticketBody" placeholder="Message body" onChange={onChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="columns">
                                <div className="column">
                                    <div className="label">Team:</div>
                                    <div className="dropdown is-hoverable pb-2">
                                        <div className="dropdown-trigger">
                                            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                                <span>{ teamsOptions.find(team => team.id === filterTeam)?.name || 'Select a team'}</span>
                                                <span className="icon is-small">
                                                    <i className="fa fa-angle-down" aria-hidden="true"></i>
                                                </span>
                                            </button>
                                        </div>
                                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                            <div className="dropdown-content">
                                                { teamsOptions.filter(val => val.id !== filterTeam).map(team => 
                                                    <span style={{cursor: 'pointer'}} key={`team-${team.id}`} className="navbar-item" onClick={() => { changeFilters('team', team.id, setFilterTeam)}}>
                                                        {team.name}
                                                    </span>
                                                ) 
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="label">Assigned User:</div>
                                    <UserList teamId={filterTeam} assigneeValue={filterAssignedTo} setAssignee={setFilterAssignedTo} onChange={changeFilters}/>
                                </div>
                            </div>
                            <button className="button is-fullwidth mt-5" id="submitBtn" onClick={submitTicket} disabled={!btnActive}>Submit Ticket</button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default CreateTicket;