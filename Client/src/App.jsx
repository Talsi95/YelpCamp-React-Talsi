import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowCampground from './pages/ShowCampground';
import Home from './pages/Home';
import NewCampgroundForm from './pages/NewCampgroundForm';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import EditCampgroundForm from './pages/EditCampgroundForm';
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios';

export default function App() {
  const [maptilerApiKey, setMaptilerApiKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const configRes = await axios.get('/api/config');
        setMaptilerApiKey(configRes.data.maptilerApiKey);
      } catch (err) {
        console.error('Failed to fetch API key:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApiKey();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home apiKey={maptilerApiKey} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/campgrounds/:id" element={<ShowCampground apiKey={maptilerApiKey} />} />
            <Route path="/campgrounds/new" element={
              <PrivateRoute>
                <NewCampgroundForm />
              </PrivateRoute>
            } />
            <Route path="/campgrounds/:id/edit" element={<EditCampgroundForm />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}
