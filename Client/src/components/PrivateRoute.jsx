import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isLoggedIn } from '../utils/auth';

export default function PrivateRoute({ children }) {
    const loggedIn = isLoggedIn();
    const location = useLocation();

    useEffect(() => {
        if (!loggedIn) {
            toast.info('התחבר כדי להמשיך', { toastId: 'login-required' });
        }
    }, [loggedIn]);

    if (!loggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}