import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout')
            localStorage.removeItem('token');
            toast.success('להתראות');
            navigate('/');
        } catch (e) {
            console.error('Logout request failed', e);
        }

    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            התנתק
        </button>
    );
}
