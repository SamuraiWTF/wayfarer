import useQueryParams from "../../hooks/useQueryParams";
import { useState } from "react";

const FilterBar = ({ userId, defaultFilters, onChange }) => {
    const selectedFilters = useQueryParams();
    const [filterStatus, setFilterStatus] = useState(selectedFilters.get('status') || '*')
    const [filterTeam, setFilterTeam] = useState(selectedFilters.get('team') || '*')
    const [filterAssignedTo, setFilterAssignedTo] = useState(selectedFilters.get('assigned_to') || '*')

    if(!onChange) {
        onChange = () => {}
    }

    const changeFilters = (key, value, setter) => {
        if(value === '*') {
            selectedFilters.delete(key)
        } else {
            selectedFilters.set(key, value); 
        }
        setter(value); 
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + selectedFilters.toString();
        window.history.pushState({path: newurl}, '', newurl);
        onChange(selectedFilters.entries);
    }
    
    return (
        <nav className="navbar is-dark" role="navigation" aria-label="filter options">
              <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item">Assigned User:</div>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                        All
                        </a>
                        <div className="navbar-dropdown">
                            <a className="navbar-item">
                                About
                            </a>
                            <a className="navbar-item">
                                Jobs
                            </a>
                            <a className="navbar-item">
                                Contact
                            </a>
                        </div>
                    </div>
                <div className="navbar-item"></div>
                <div className="navbar-item">Team:</div>
                <div className="navbar-item has-dropdown is-hoverable">
                        <span className="navbar-link">
                        { filterTeam }
                        </span>
                        <div className="navbar-dropdown">
                            {
                                ['*', 'Help Desk', 'Customer Support'].filter(val => val !== filterTeam).map(team => 
                                    <span style={{cursor: 'pointer'}} key={`team-${team}`} className="navbar-item" onClick={() => { changeFilters('team', team, setFilterTeam)}}>
                                        {team}
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