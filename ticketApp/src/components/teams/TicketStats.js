const TicketStats = ({ data: { open, closed, unassigned, overdue }, onClick: onTileClick }) => {
    if(!onTileClick)
        onTileClick = (status) => { alert(`navigate to ${status} tickets.`) }
    return <div className="container has-text-center">
        <div className="tile is-ancestor">
            <div className="tile is-vertical is-8">
                <div className="tile">
                    <div className="tile is-8 is-parent is-vertical">
                        <article className="tile is-child notification is-link is-clickable" onClick={() => { onTileClick('open') }}>
                            <p className="title">{open || 0}</p>
                            <p className="subtitle">Open</p>
                        </article>
                        <article className="tile is-child notification is-warning is-clickable" onClick={() => { onTileClick('unassigned') }}>
                            <p className="title">{closed || 0}</p>
                            <p className="subtitle">Unassigned</p>
                        </article>
                    </div>
                    <div className="tile is-8 is-parent is-vertical">
                        <article className="tile is-child notification is-danger is-clickable" onClick={() => { onTileClick('overdue') }}>
                            <p className="title">{overdue || 0}</p>
                            <p className="subtitle">Overdue</p>
                        </article>
                        <article className="tile is-child notification is-info is-clickable" onClick={() => { onTileClick('closed') }}>
                            <p className="title">{unassigned || 0}</p>
                            <p className="subtitle">Closed</p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default TicketStats