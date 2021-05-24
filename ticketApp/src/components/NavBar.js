import { Link } from "react-router-dom";

const NavBar = ({ userId }) => {
  return ( 
  <nav className="navbar is-info" role="navigation" style={{zIndex: 5000}} aria-label="main navigation">
    <div className="navbar-brand">
        <a className="navbar-item is-tall" href="/">
            <img src="/wayfarer_tf_logo.svg" className="is-tall" alt="logo" width="112" height="28" />
        </a>
        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

  <div id="navbarBasicExample" className="navbar-menu">
    <div className="navbar-start">
      <Link to="/" className="navbar-item">
        Dashboard
      </Link>

      <Link to="/teams" className="navbar-item">
        Teams
      </Link>

      <div className="navbar-item has-dropdown is-hoverable">
        <Link to="/tickets" className="navbar-link">
          Tickets
        </Link>

        <div className="navbar-dropdown">
          <Link to={`/new`} className="navbar-item">
            New Ticket
          </Link>
          <hr className="navbar-divider"/>
          <Link to={`/user/${userId}/tickets?status=open`} className="navbar-item">
            My Open Tickets
          </Link>
          <Link to={`/user/${userId}/tickets?group=watched`} className="navbar-item">
            Watched Tickets
          </Link>
          <Link to="/tickets?assignedTo=unassigned" className="navbar-item">
            Unassigned Tickets
          </Link>
        </div>
      </div>

      <Link to="/new" className="navbar-item">
        New Ticket
      </Link>
    </div>

    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          { /*<a className="button is-link">
            Log in
  </a> */}
        </div>
      </div>
    </div>
  </div>
</nav> 
  )
}

export default NavBar;