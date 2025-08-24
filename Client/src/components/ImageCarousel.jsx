import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function CampgroundCarousel({ images, title }) {
    if (!images || images.length === 0) {
        return null;
    }

    if (images.length === 1) {
        return (
            <div className="mb-3">
                <img src={images[0].url} alt={title} className="img-fluid rounded" />
            </div>
        );
    }

    return (
        <div id="campgroundCarousel" className="carousel slide mb-3" data-bs-ride="carousel">
            <div className="carousel-inner">
                {images.map((img, i) => (
                    <div
                        className={`carousel-item ${i === 0 ? 'active' : ''}`}
                        key={img._id || i}
                    >
                        <img
                            src={img.url}
                            className="d-block w-100"
                            alt={title}
                            style={{ maxHeight: '500px', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </div>

            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#campgroundCarousel"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">הקודם</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#campgroundCarousel"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">הבא</span>
            </button>
        </div>
    );
}
