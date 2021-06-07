import { Redirect } from "react-router-dom";

const Dashboard = ({ hasAuth }) => {
    if(!hasAuth) {
        return <Redirect to="/login?goto=/dashboard" />
    } else {
        return <h1>Dashboard</h1>
    }
}

export default Dashboard;