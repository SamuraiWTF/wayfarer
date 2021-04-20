import Routes from './Routes';
import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
      <Routes></Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
