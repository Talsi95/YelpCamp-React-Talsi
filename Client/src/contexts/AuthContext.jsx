import { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, getUserId } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkTokenExpiry = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            const now = Date.now();

            if (now >= expiry) {
                logout();
            } else {
                setTimeout(() => {
                    logout();
                }, expiry - now);
            }
        } catch (err) {
            console.error("Invalid token format", err);
            logout();
        }
    };

    const login = (token) => {
        localStorage.setItem('token', token);
        const userId = getUserId();
        setUser(userId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        const checkUserStatus = async () => {
            const userIsLoggedIn = isLoggedIn();
            if (userIsLoggedIn) {
                const userId = getUserId();
                setUser(userId);
                checkTokenExpiry();
            }
            setLoading(false);
        };
        checkUserStatus();
    }, []);

    const value = {
        user,
        loading,
        isLoggedIn: !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};