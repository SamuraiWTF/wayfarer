/* eslint-disable eqeqeq */
import useQueryParams from "../../hooks/useQueryParams";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import AuthContext from "../context/AuthContext";
import { useContext } from 'react';

const FilterBar = ({ userId, defaultFilters, onChange }) => {
    const { token, clearAuth } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const selectedFilters = new URLSearchParams(window.location.search);
    const [filterStatus, setFilterStatus] = useState(selectedFilters.get('status') || '*')
    const [filterTeam, setFilterTeam] = useState(selectedFilters.get('team') || '*')
    const [filterAssignedTo, setFilterAssignedTo] = useState(selectedFilters.get('assigned_to') || '*')
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

    if(isLoading) {
        return <nav className="navbar is-dark" role="navigation" aria-label="loading filter options">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item">Loading options...</div>
                </div>
            </div>
        </nav>
    }

    if(error) {
        return <nav className="navbar is-dark" role="navigation" aria-label="loading filter options">
        <div className="navbar-menu">
            <div className="navbar-start">
                <div className="navbar-item">Error loading filtering options.</div>
            </div>
        </div>
    </nav>
    }

    const { users, teams } = data.data;
    const teamsOptions = [{ id: -1, name: '*' } , ...teams];
    const usersOptions = [{ id: -1, name: '*' }, ...users];

    const changeFilters = (key, value, setter) => {
        if(value === -1) {
            selectedFilters.delete(key)
        } else {
            selectedFilters.set(key, value); 
        }
        setter(value); 
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + selectedFilters.toString();
        window.history.pushState({path: newurl}, '', newurl);
        onChange(selectedFilters);
    }
    
    return (
        <nav className="navbar is-dark" role="navigation" aria-label="filter options">
              <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item">Assigned User:</div>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <span className="navbar-link">
                            { usersOptions.find(user => user.id == filterAssignedTo)?.name || '*'}
                        </span>
                        <div className="navbar-dropdown">
                            { usersOptions.filter(val => val.id != filterAssignedTo).map(assignee => 
                                <span style={{cursor: 'pointer'}} key={`user-${assignee.id}`} className="navbar-item" onClick={() => { changeFilters('user', assignee.id, setFilterAssignedTo)}}>
                                    {assignee.name}
                                </span>
                              ) 
                            }
                        </div>
                    </div>
                <div className="navbar-item"></div>
                <div className="navbar-item">Team:</div>
                <div className="navbar-item has-dropdown is-hoverable">
                        <span className="navbar-link">
                            { teamsOptions.find(team => team.id == filterTeam)?.name || '*' }
                        </span>
                        <div className="navbar-dropdown">
                            {
                                teamsOptions.filter(val => val.id != filterTeam).map(team => 
                                    <span style={{cursor: 'pointer'}} key={`team-${team.id}`} className="navbar-item" onClick={() => { changeFilters('team', team.id, setFilterTeam)}}>
                                        {team.name}
                                    </span>    
                                )
                            }
                        </div>
                </div>
                <div className="navbar-item"></div>
                <div className="navbar-item">Status:</div>
                <div className="navbar-item has-dropdown is-hoverable">
                        <span className="navbar-link">
                        {filterStatus}
                        </span>
                        <div className="navbar-dropdown">
                            {
                                ['*', 'open', 'closed'].filter(val => val !== filterStatus).map(status => 
                                    <span style={{cursor: 'pointer'}} key={`status-${status}`} className="navbar-item" onClick={() => { changeFilters('status', status, setFilterStatus) }}>
                                        { status }
                                    </span>
                                )
                            }
                        </div>
                </div>
              </div>
            </div>
        </nav>
    )
}

export default FilterBar