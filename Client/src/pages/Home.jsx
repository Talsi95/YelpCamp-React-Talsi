import { useEffect, useState } from 'react';
import axios from 'axios';
import CampgroundList from '../components/CampgroundList';

export default function Home({ apiKey }) {
    const [campgrounds, setCampgrounds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get('http://localhost:3000/api/campgrounds')
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

    // useEffect(() => {
    //     axios.get('http://localhost:3000/api/campgrounds')
    //         .then(res => setCampgrounds(res.data))
    //         .catch(err => console.error(err));
    // }, []);

    return (
        <div>
            {/* <Link to="/campgrounds/new" className="btn btn-success">הוסף מקום</Link> */}
            <CampgroundList campgrounds={campgrounds} apiKey={apiKey} />
            {/* <Route path="/campgrounds/:id" element={<ShowCampground apiKey={apiKey} />} /> */}
        </div>
    );
}
