import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState } from "react";
import AuthContext from "../components/context/AuthContext";
import { useContext } from "react";
import UserLabel from "../components/shared/UserLabel";
import UserList from "../components/tickets/UserList";

const CreateTicket = ({ userId, defaultFilters, onChange }) => {
    function get(object, key) {
        var result = object[key];
        return (typeof result !== "undefined") ? result : null;
    }
    function set(object, key, value) {
        object[key] = value;
    }
    function deleteKey(object, key) {
        delete object[key];
    }

    const { token, clearAuth } = useContext(AuthContext);
    const selectedFilters = {}
    const [filterTeam, setFilterTeam] = useState(get(selectedFilters, 'team') || 'Select a team')
    const { isLoading, error, data } = useQuery('filterOptions', () => 
        fetch(`http://localhost:3001/options/filtering`, { headers: { 'Authorization': `Bearer ${token}`}}).then(res => {
            return res.json()
        }),
        {
            onError: (err) => {
                console.log('query error ', err)
            }
        }
    )

    if(!onChange) {
        onChange = () => {}
    }

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(data.error) return data.error

    const { users, teams } = data.data;
    const teamsOptions = [{ id: -1, name: 'Select a team' } , ...teams];
    const usersOptions = [{ id: -1, name: 'Select a user' }, ...users];

    const changeFilters = (key, value, setter) => {
        if(value === -1) {
            deleteKey(selectedFilters, key);
        } else {
            set(selectedFilters, key, value);
        }
        setter(value);
        onChange(selectedFilters);
    }

    const submitTicket = () => {
        console.log("submit");
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
                                    <input className="input" type="text" placeholder="Title"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Message</label>
                                <div className="control">
                                    <textarea className="textarea" placeholder="Message body"/>
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
                                    <UserList teamId={filterTeam}/>
                                </div>
                            </div>
                            <button className="button is-fullwidth mt-5" onClick={() => {submitTicket()}}>Submit Ticket</button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default CreateTicket;