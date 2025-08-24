import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import ImageCarousel from '../components/ImageCarousel';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import ShowMap from '../components/ShowMap';
import { getToken } from '../utils/auth';

export default function ShowCampground({ apiKey }) {
    const { id } = useParams();
    const [campground, setCampground] = useState(null);
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const defaultImage = "https://res.cloudinary.com/dlig7gqsb/image/upload/v1754990857/YelpCamp/nayue5rhsoxxzy51zwr6.jpg";

    useEffect(() => {
        const fetchCampground = async () => {
            try {
                const res = await axios.get(`/api/campgrounds/${id}`);
                setCampground(res.data);
            } catch (err) {
                console.error('שגיאה:', err);
                toast.error('אופס, אירעה שגיאה');
            }
        };

        fetchCampground();
    }, [id]);

    // const isOwner = useMemo(() => {
    //     if (!isLoggedIn || !campground?.author?._id) return false;
    //     const currentUserId = typeof user === 'string' ? user : (user?.id || user?._id);
    //     return currentUserId === campground.author._id;
    // }, [isLoggedIn, user, campground]);

    // const avg = useMemo(() => {
    //     const v = Number(campground?.averageRating);
    //     return Number.isFinite(v) ? v.toFixed(1) : '—';
    // }, [campground]);


    if (!campground) return <div>טוען...</div>;

    const handleDelete = async () => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את מקום האירוח הזה?')) return;

        const token = getToken();
        try {
            await axios.delete(`http://localhost:3000/api/campgrounds/${campground._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('נמחק בהצלחה');
            navigate('/')
        } catch (err) {
            console.error(err);
            toast.error('שגיאה במחיקה');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) return;
        const token = getToken();
        try {
            await axios.delete(`http://localhost:3000/api/campgrounds/${campground._id}/reviews/${reviewId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('נמחק בהצלחה');
            setCampground(prevCampground => ({
                ...prevCampground,
                reviews: prevCampground.reviews.filter(r => r._id !== reviewId)
            }));
        } catch (err) {
            console.error(err);
            toast.error('שגיאה במחיקה');
        }

    }

    return (
        <div className='row'>
            <div className="col-12 col-md-6">
                <div className="mb-3">
                    {campground.images && campground.images.length > 0 ? (
                        <ImageCarousel images={campground.images} />
                    ) : (
                        <img
                            src={defaultImage}
                            alt="Default campground"
                            className="img-fluid rounded"
                        />
                    )}
                </div>
                {/* <ImageCarousel images={campground.images} /> */}
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{campground.title}</h5>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '1.2rem', color: '#FFD700' }}>⭐</span>
                            <span>{Number(campground.averageRating).toFixed(1)}</span>
                        </div>
                        <p className="card-text">{campground.description}</p>
                    </div>
                    <div className="list-group list-group-flush">
                        <li className="list-group-item text-muted">{campground.location}</li>
                        <li className="list-group-item">הועלה ע״י: {campground.author?.username}</li>
                        <li className="list-group-item">{campground.price}₪ ללילה</li>
                    </div>
                    {isLoggedIn && user === campground.author?._id && (
                        <div className="card-body">
                            <button onClick={handleDelete} className="btn btn-danger">
                                מחק מקום אירוח
                            </button>
                            <Link to={`/campgrounds/${campground._id}/edit`} className="card-link btn btn-info">
                                ערוך מקום אירוח
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="col-12 col-md-6">
                {(campground.geometry?.coordinates && apiKey) ? (
                    <ShowMap campground={campground} apiKey={apiKey} />
                ) : (
                    <div className="alert alert-warning">מפת המקום לא זמינה.</div>
                )}
                <h2>תגובות</h2>
                {campground.reviews && campground.reviews.length > 0 ? (
                    campground.reviews.map((r) => (
                        <div key={r._id} className='card mb-3'>
                            <div className="card-body">
                                <h5 className='card-title'>דירוג: {r.rating}</h5>
                                <p className='starability-result'>הועלה ע״י: {r.author.username}</p>
                                <p className='card-text'>{r.body}</p>
                                {isLoggedIn && user === r.author._id && (
                                    <button
                                        onClick={() => handleDeleteReview(r._id)}
                                        className="btn btn-danger"
                                    >
                                        מחק
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>אין תגובות עדיין</p>
                )}
                <ReviewForm campgroundId={campground._id} onReviewAdded={() => {
                    axios.get(`http://localhost:3000/api/campgrounds/${id}`)
                        .then(res => setCampground(res.data));
                }} />
            </div>
        </div>

    );
}