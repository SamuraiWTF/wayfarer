import { Link } from 'react-router-dom';

const TeamMemberCard = ({ data: person, editable, removable, onAction }) => {
    const colors = {
        owner: {
            bgclass: 'has-background-dark',
            txtclass: 'has-text-light'
        },
        manager: {
            bgclass: 'has-background-info',
            txtclass: 'has-text-info-light'
        },
        member: {
            bgclass: 'has-background-primary',
            txtclass: 'has-text-info-light'
        }
    }
    const bgcolor = colors[person.role].bgclass;
    const txtcolor = colors[person.role].txtclass;
    return (
        <div className={`card ${bgcolor} mb-5`}>
            <div className={`card-content ${bgcolor}`}>
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-48x48">
                            <img src="/avatar.svg" alt="Placeholder avatar" style={{height:'48px'}} />
                        </figure>
                    </div>
                    <div className="media-content">
                        <p className={`title is-4 ${txtcolor}`}><Link className={txtcolor} to={`/user/${person.user_id}`}>{person.name}</Link></p>
                        <p className={`subtitle is-6 ${txtcolor}`}>{person.role}</p>
                    </div>
                </div>
                <div className={`content ${txtcolor}`}>
                    { person.open_tickets } open tickets.
                </div>
            </div>
            <footer className="card-footer">
                {
                    (editable && person.role !== 'owner') ? 
                    <span className="card-footer-item is-clickable has-background-warning" onClick={() => { onAction('change_role', person)}}>Change Role</span> 
                    : ''
                }
                {
                    (removable && person.role !== 'owner') ?
                    <span className="card-footer-item is-clickable has-background-danger has-text-light" onClick={() => { onAction('remove', person)}}>Remove</span>
                    : ''
                }
            </footer>
        </div>
    )
}

export default TeamMemberCard;