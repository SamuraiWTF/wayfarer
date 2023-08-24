import React, { useState } from 'react';
import Routes from './Routes';
import AuthContext from './components/context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import useConfig from "./useConfig";

const queryClient = new QueryClient()

function App() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('currentUserId'));
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('isAdmin') || false);
  const { isLoaded, config } = useConfig();
  const authStatusChanged = () => {
    setCurrentUserId(localStorage.getItem('currentUserId'));
    setAuthToken(localStorage.getItem('authToken'));
    setIsAdmin(sessionStorage.getItem('isAdmin') || false);
  }
  let clearAuth = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('isAdmin');
    authStatusChanged();
  }

  clearAuth = clearAuth.bind(this);

  const defaultAuthContext = {
    token: authToken,
    userId: currentUserId,
    statusChanged: authStatusChanged,
    clearAuth: clearAuth
  }

  return (
    <AuthContext.Provider value={defaultAuthContext}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
              <Routes isAdmin={isAdmin} authToken={authToken} currentUserId={currentUserId} authStatusChanged={authStatusChanged}></Routes>
        </div>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
