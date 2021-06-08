import AuthContext from "../components/context/AuthContext";
import { useContext } from "react";
import { Redirect } from "react-router-dom";

const Logout = () => {
    const { clearAuth } = useContext(AuthContext);
    clearAuth();
    return <Redirect to="/login" />
}

export default Logout;