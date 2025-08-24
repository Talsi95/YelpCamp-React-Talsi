import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({ username: "", password: "", email: "" });
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        const formEl = e.currentTarget;
        e.preventDefault();

        if (formEl.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        };

        try {
            const res = await axios.post('/api/register', form);
            login(res.data.token);
            // localStorage.setItem('token', res.data.token);
            toast.success('נרשמת בהצלחה, ברוך הבא!');
            const redirectTo = location.state?.from?.pathname || '/';
            navigate(redirectTo, { replace: true });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('שגיאה לא ידועה, נסה שוב');
            }
        }
        setValidated(true);
    }
    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                    <div className="card shadow">
                        <img src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
                            alt="" className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">הרשמה</h5>
                            <form className={`row g-3 needs-validation ${validated ? 'was-validated' : ''}`}
                                noValidate
                                validated={validated ? 'true' : undefined}
                                onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="username">שם משתמש</label>
                                    <input className="form-control" type="text" id="username" name="username" value={form.username} onChange={handleChange} required />
                                    <div className="invalid-feedback">
                                        יש למלא שם משתמש.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">מייל</label>
                                    <input className="form-control" type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                                    <div className="invalid-feedback">
                                        יש למלא מייל.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="password">סיסמא</label>
                                    <input className="form-control" type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
                                    <div className="invalid-feedback">
                                        יש למלא סיסמא.
                                    </div>
                                </div>
                                <button className="btn btn-success btn-block">הירשם</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// <form onSubmit={handleSubmit}>
//     <input name="username" value={form.username} onChange={handleChange} placeholder="שם משתמש" />
//     <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="מייל" />
//     <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="סיסמה" />
//     <button>הירשם</button>
// </form>
