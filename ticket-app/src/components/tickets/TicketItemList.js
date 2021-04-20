import { Link } from "react-router-dom";

const TicketItemList = ({ data, showTeam }) => {
    return (
        <table class="table">
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
                { data.map(rec => <tr key={rec.id}>
                    <td><Link to={`/ticket/${rec.id}`}>{rec.id}</Link></td>
                    <td><Link to={`/ticket/${rec.id}`}>{rec.title}</Link></td>
                    <td><Link to={`/user/${rec.assignedTo.id}`}>{rec.assignedTo.name}</Link></td>
                    <td>{rec.status}</td>
                    <td>{rec.due}</td>
                    { showTeam ? <td>{rec.team}</td> : <></>}
                    <td>...</td>
                </tr>)}
            </tbody>
        </table>
    )
}

export default TicketItemList;