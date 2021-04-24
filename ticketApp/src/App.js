import React, { useState } from 'react';
import Routes from './Routes';
import AuthContext from './components/context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';

const queryClient = new QueryClient()

function App() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('currentUserId'));
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const authStatusChanged = () => {
    setCurrentUserId(localStorage.getItem('currentUserId'));
    setAuthToken(localStorage.getItem('authToken'));
  }
  const clearAuth = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('authToken');
    authStatusChanged();
  }
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
              <Routes authToken={authToken} currentUserId={currentUserId} authStatusChanged={authStatusChanged}></Routes>
        </div>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
