import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import { Toaster } from './components/ui/toaster';
import Header from './components/common/Header';
import routes from './routes';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
