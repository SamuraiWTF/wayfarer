import React, { useState } from 'react';
import Routes from './Routes';
import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css';

const queryClient = new QueryClient()

function App() {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('currentUserId'))
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))
  const authStatusChanged = () => {
    setCurrentUserId(localStorage.getItem('currentUserId'))
    setAuthToken(localStorage.getItem('authToken'))
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
             <Routes authToken={authToken} currentUserId={currentUserId} authStatusChanged={authStatusChanged}></Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
