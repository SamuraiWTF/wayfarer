import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import NavBar from "./components/NavBar";
import Dashboard from "./views/Dashboard";
import TeamDetails from "./views/TeamDetails";
import TicketDetails from "./views/TicketDetails";
import TicketList from "./views/TicketList";
import TeamList from "./views/TeamList";
import UserDetails from "./views/UserDetails";
import Login from "./views/Login";
import CreateTicket from "./views/CreateTicket";
import Logout from "./views/Logout";
import AdminUsers from "./views/AdminUsers";

const Routes = ({ currentUserId, authToken, authStatusChanged, isAdmin }) => {
  let authenticated = (currentUserId && authToken) ? true : false;  
    return (
    <Router>
        <main>
            <NavBar hasAuth={authenticated} isAdmin={ isAdmin } userId={currentUserId} />
            <Switch>
                <Route exact path="/" component={Dashboard}>
                  <Dashboard hasAuth={authenticated} />
                </Route>
                <Route path="/team/:teamId">
                  <TeamDetails hasAuth={authenticated} />  
                </Route>
                <Route path="/teams">
                  <TeamList hasAuth={authenticated} />
                </Route>
                <Route path="/ticket/new">
                  <CreateTicket hasAuth={authenticated} />
                </Route>
                <Route path="/ticket/:ticketId">
                  <TicketDetails hasAuth={authenticated} />
                </Route>
                <Route path="/tickets">
                  <TicketList hasAuth={authenticated} />
                </Route>
                <Route path="/user/:userId/teams" exact={true}>
                  <TeamList hasAuth={authenticated} />
                </Route>
                <Route path="/user/:userId">
                  <UserDetails hasAuth={authenticated} />
                </Route>
                <Route path="/user/:userId">
                  <UserDetails hasAuth={authenticated} />
                </Route>
                <Route path="/user">
                  <UserDetails hasAuth={authenticated} />
                </Route>
                <Route path="/login">
                  <Login authStatusChanged={authStatusChanged} hasAuth={authenticated} />
                </Route>
                <Route path="/logout">
                  <Logout />
                </Route>
                { isAdmin ? 
                  <Route path="/admin/users">
                    <AdminUsers hasAuth={authenticated} />
                  </Route> : <></>
                }
            </Switch>
        </main>
    </Router>
  );
}

export default Routes;