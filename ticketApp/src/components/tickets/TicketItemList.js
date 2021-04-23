import { Link } from "react-router-dom";

const formatDate = (dateString) => {
    return Intl.DateTimeFormat(navigator.language, { weekday: 'short', month: 'long', day: 'numeric' }).format(new Date(dateString));
}

const TicketItemList = ({ data, showTeam }) => {
    let rows = data.map(row => { 
        return <tr key={row.id}>
            <td><Link to={`/ticket/${row.id}`}>{row.title}</Link></td>
            <td><Link to={`/user/${row.assigned_to}`}>
                {row.assigned_to_name}</Link>
            </td>
            <td>{row.status}</td>
            <td>{row.due_date ? formatDate(row.due_date) : 'none'}</td>
            <td><Link to={`/team/${row.team_id}`}>{row.team_name}</Link></td>
        </tr> 
    })
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>title</th>
                    <th>assignedTo</th>
                    <th>status</th>
                    <th>due</th>
                    { showTeam ? <th>team</th> : <></>}
                    <th>{ /* Placeholder for icon buttons */ }</th>
                </tr>
            </thead>
            <tbody>
                {rows}
                { /*data.map(rec => <tr key={rec.id}>
                    <td><Link to={`/ticket/${rec.id}`}>{rec.id}</Link></td>
                    <td><Link to={`/ticket/${rec.id}`}>{rec.title}</Link></td>
                    <td><Link to={`/user/${rec.assignedTo.id}`}>{rec.assignedTo.name}</Link></td>
                    <td>{rec.status}</td>
                    <td>{rec.due}</td>
                    { showTeam ? <td>{rec.team}</td> : <></>}
                    <td>...</td>
                </tr>)*/ }
            </tbody>
        </table>
    )
}

export default TicketItemList;