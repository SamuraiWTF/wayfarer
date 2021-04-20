import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import NavBar from "./components/NavBar";
import Dashboard from "./views/Dashboard";
import TeamDetails from "./views/TeamDetails";
import TicketDetails from "./views/TicketDetails";
import TicketList from "./views/TicketList";
import TeamList from "./views/TeamList";
import UserDetails from "./views/UserDetails";

const Routes = () => {
  return (
    <Router>
        <main>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/team/:teamId" component={TeamDetails} />
                <Route path="/teams" component={TeamList} />
                <Route path="/ticket/:ticketId" component={TicketDetails} />
                <Route path="/team/:teamId/tickets" component={TicketList} />
                <Route path="/tickets" component={TicketList} />
                <Route path="/user/:userId/tickets/team/:teamId/:filterGroup" component={TicketList} />
                <Route path="/user/:userId/tickets/:filterGroup" component={TicketList} />
                <Route path="/user/:userId/tickets" component={TicketList} />
                <Route path="/user/:userId/teams" component={TeamList} />
                <Route path="/user/:userId" component={UserDetails} />
                <Route path="/user" component={UserDetails} />
            </Switch>
        </main>
    </Router>
  );
}

export default Routes;