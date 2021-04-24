import React from "react";

const AuthContext = React.createContext({
    token: '',
    userId: '',
    statusChanged: () => {},
    clearAuth: () => {}
});

export default AuthContext;