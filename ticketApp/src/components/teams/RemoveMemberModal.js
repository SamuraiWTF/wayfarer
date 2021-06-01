const RemoveMemberModal = ({ member, team, onClickClose, onClickConfirm }) => {
    return <div className="modal-card">
        <header className="modal-card-head">
        <p className="modal-card-title">Remove User from { team }</p>
        <button className="delete" aria-label="close"  onClick={onClickClose}></button>
        </header>
        <section className="modal-card-body">
            Do you want to remove { member.name } from { team }? Click confirm to complete the removal.
        </section>
        <footer className="modal-card-foot">
        <button className="button is-success" onClick={() => onClickConfirm(member)}>Remove user</button>
        <button className="button" onClick={onClickClose}>Cancel</button>
        </footer>
    </div>
}

export default RemoveMemberModal;