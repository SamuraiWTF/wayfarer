import { Link } from "react-router-dom";

const TicketItemList = ({ data, showTeam }) => {
    console.log('tldata', data)
    let rows = data.map(row => { 
        return <tr>
            <td>{row.ticketId}</td>
            <td>{row.title}</td>
            <td><Link to={`/user/${row.assignedTo.id}`}>
                {row.assignedTo.name}</Link>
            </td>
            <td>{row.status}</td>
            <td>{row.due ? row.due : 'none'}</td>
            <td>{row.team.name}</td>
        </tr> 
    })
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>id</th>
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