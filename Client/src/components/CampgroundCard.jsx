import { Link } from 'react-router-dom';

export default function CampgroundCard({ campground }) {
    const defaultImage = "https://res.cloudinary.com/dlig7gqsb/image/upload/v1754990857/YelpCamp/nayue5rhsoxxzy51zwr6.jpg";

    const imageUrl = (campground.images && campground.images.length > 0)
        ? campground.images[0].url
        : defaultImage;

    return (
        <div className="card mb-3">
            <img
                src={imageUrl}
                className="card-img-top"
                alt={campground.title}
            />
            {/* <img src={campground.images[0].url} className="card-img-top" alt={campground.title} /> */}
            <div className="card-body">
                <h5 className="card-title">{campground.title}</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '1.2rem', color: '#FFD700' }}>⭐</span>
                    <span>{Number(campground.averageRating).toFixed(1)}</span>
                </div>
                <p className="card-text">{campground.description}</p>
                <p className="card-text text-muted">₪{campground.price}</p>
                <Link to={`/campgrounds/${campground._id}`} className="btn btn-primary">צפה בפרטים</Link>
            </div>
        </div>
    );
}
