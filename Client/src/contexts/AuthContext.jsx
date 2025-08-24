import { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, getUserId } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // כאן נאחסן את מזהה המשתמש
    const [loading, setLoading] = useState(true);

    const checkTokenExpiry = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            const now = Date.now();

            if (now >= expiry) {
                // אם הטוקן כבר פג תוקפו, בצע התנתקות מיידית
                logout();
            } else {
                // קבע טיימר לביצוע התנתקות אוטומטית בזמן התפוגה
                setTimeout(() => {
                    logout();
                }, expiry - now);
            }
        } catch (err) {
            console.error("Invalid token format", err);
            // אם יש שגיאה בטוקן, בצע התנתקות מיידית
            logout();
        }
    };

    const login = (token) => {
        // לאחר קבלת טוקן חדש, נשמור אותו ונעדכן את המצב
        localStorage.setItem('token', token);
        const userId = getUserId();
        setUser(userId);
    };

    const logout = () => {
        // מחיקת הטוקן ועדכון המצב
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
        isLoggedIn: !!user, // בודק האם יש משתמש במצב
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};