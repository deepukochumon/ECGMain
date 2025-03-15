{/*new edit by jissin */}
//protected route fixed

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Upload } from './pages/dashboard/Upload';
import { Results } from './pages/dashboard/Results';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { Profile } from './pages/dashboard/Profile';
import { HardwareAnalysis } from './components/hardware/HardwareAnalysis';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route path="" element={<DashboardLayout />}>
              <Route path="upload" element={<Upload />} />
              <Route path="results" element={<Results />} />
              <Route path="profile" element={<Profile />} />
              <Route path="hardware" element={<HardwareAnalysis />} />
            </Route>
        </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right" // Adjust the position as needed
        autoClose={3000} // Time before toast disappears (in milliseconds)
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Choose between 'light', 'dark', or 'colored'
      />
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
