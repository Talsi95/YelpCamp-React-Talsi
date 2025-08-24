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




// import { Navigate } from 'react-router-dom';
// import { isLoggedIn } from '../utils/auth';
// import { toast } from 'react-toastify';

// export default function PrivateRoute({ children }) {
//     if (!isLoggedIn()) {
//         toast.info('התחבר כדי להוסיף מקום');
//         return <Navigate to="/login" />;
//     }
//     return children;
// }
