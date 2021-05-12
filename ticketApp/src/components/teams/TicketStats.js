
const TicketStats = ({ data: { open, closed, unassigned, overdue }, onClick: onTileClick }) => {


    if(!onTileClick)
        onTileClick = (status) => { alert(`navigate to ${status} tickets.`) }
    return <div className="container has-text-center">
        <div class="tile is-ancestor">
            <div class="tile is-vertical is-8">
                <div class="tile">
                    <div class="tile is-8 is-parent is-vertical">
                        <article class="tile is-child notification is-link is-clickable" onClick={() => { onTileClick('open') }}>
                            <p class="title">{open || 0}</p>
                            <p class="subtitle">Open</p>
                        </article>
                        <article class="tile is-child notification is-warning is-clickable" onClick={() => { onTileClick('unassigned') }}>
                            <p class="title">{closed || 0}</p>
                            <p class="subtitle">Unassigned</p>
                        </article>
                    </div>
                    <div class="tile is-8 is-parent is-vertical">
                        <article class="tile is-child notification is-danger is-clickable" onClick={() => { onTileClick('overdue') }}>
                            <p class="title">{overdue || 0}</p>
                            <p class="subtitle">Overdue</p>
                        </article>
                        <article class="tile is-child notification is-info is-clickable" onClick={() => { onTileClick('closed') }}>
                            <p class="title">{unassigned || 0}</p>
                            <p class="subtitle">Closed</p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default TicketStats