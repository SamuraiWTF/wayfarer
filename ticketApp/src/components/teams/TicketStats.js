import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useParams, Link } from "react-router-dom";

const TicketStats = ({ data: { open, closed, unassigned, overdue }, onClick: onTileClick }) => {
    const { userId: currentUser } = useContext(AuthContext);
    let { teamId, userId } = useParams();
    if(userId === undefined) {
        userId = currentUser;
    }

    if(!onTileClick)
        onTileClick = () => { }

    return <div className="container has-text-center">
        <div className="tile is-ancestor">
            <div className="tile is-vertical is-8">
                <div className="tile">
                    <div className="tile is-8 is-parent is-vertical">
                        <Link className="tile is-child notification is-link is-clickable" to={`/user/${userId}/tickets?team=${teamId}&status=open`}>
                            <p className="title">{open || 0}</p>
                            <p className="subtitle">Open</p>
                        </Link>
                        <Link className="tile is-child notification is-warning is-clickable" to={`/user/${userId}/tickets?team=${teamId}&status=closed`}>
                            <p className="title">{closed || 0}</p>
                            <p className="subtitle">Closed</p>
                        </Link>
                    </div>
                    <div className="tile is-8 is-parent is-vertical">
                        <Link className="tile is-child notification is-danger is-clickable" to={`/user/${userId}/tickets?team=${teamId}&due=overdue`}>
                            <p className="title">{overdue || 0}</p>
                            <p className="subtitle">Overdue</p>
                        </Link>
                        <Link className="tile is-child notification is-info is-clickable" to={`/user/${userId}/tickets?team=${teamId}&user=0`}>
                            <p className="title">{unassigned || 0}</p>
                            <p className="subtitle">Unassigned</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default TicketStats