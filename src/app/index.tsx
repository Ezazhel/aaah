/**
 * Main application entry point
 * This file serves as the root component that combines providers and routing
 * It replaces the current App.tsx and centralizes app-level configuration
 */
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './provider';
import { AppRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
