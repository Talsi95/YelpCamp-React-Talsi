import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('התנתקת בהצלחה, להתראות!');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <div className="container-fluid d-flex justify-content-between">
                <button
                    className="navbar-toggler order-1"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <Link className="navbar-brand order-2 mx-2" to="/">YelpCamp</Link>

                <div className="collapse navbar-collapse justify-content-between order-3" id='navbarNav'>

                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">דף הבית</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="campgrounds/new">הוסף מקום</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                                        התנתק
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">התחבר</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">הירשם</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}