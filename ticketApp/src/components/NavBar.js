import { Link } from "react-router-dom";

const NavBar = () => {
  const currentUserId = localStorage.getItem('userId')

  return ( 
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
        <a className="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" alt="logo" width="112" height="28" />
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
          <Link to={`/user/${currentUserId}/tickets?status=open`} className="navbar-item">
            My Open Tickets
          </Link>
          <Link to={`/user/${currentUserId}/tickets?group=watched`} className="navbar-item">
            Watched Tickets
          </Link>
          <Link to="/tickets?assignedTo=unassigned" className="navbar-item">
            Unassigned Tickets
          </Link>
        </div>
      </div>
    </div>

    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          <a className="button is-primary">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav> 
  )
}

export default NavBar;