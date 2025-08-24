import { useEffect, useState } from 'react';
import axios from 'axios';
import CampgroundList from '../components/CampgroundList';

export default function Home({ apiKey }) {
    const [campgrounds, setCampgrounds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get('/api/campgrounds')
                    .then(res => setCampgrounds(res.data))
                    .catch(err => console.error(err));
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>טוען נתונים...</div>;
    }

    return (
        <div>
            <CampgroundList campgrounds={campgrounds} apiKey={apiKey} />
        </div>
    );
}
