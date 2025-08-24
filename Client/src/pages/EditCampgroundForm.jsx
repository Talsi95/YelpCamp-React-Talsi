import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';

export default function EditCampgroundForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        images: []
    });

    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/campgrounds/${id}`)
            .then(res => {
                setFormData({
                    title: res.data.title,
                    description: res.data.description,
                    location: res.data.location,
                    price: res.data.price,
                    images: res.data.images
                })
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewImages(Array.from(e.target.files));
    };

    const toggleDeleteImage = (filename) => {
        setImagesToDelete((prev) =>
            prev.includes(filename) ? prev.filter(f => f !== filename) : [...prev, filename]
        );
    };


    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        };

        try {
            setLoading(true);
            const token = getToken();
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('price', formData.price);

            imagesToDelete.forEach(filename => {
                formDataToSend.append('deleteImages[]', filename);
            });

            newImages.forEach(file => {
                formDataToSend.append('images', file);
            });

            await axios.put(
                `http://localhost:3000/api/campgrounds/${id}`,
                formDataToSend,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );
            toast.info('הפרטים נשמרו בהצלחה');
            navigate(`/campgrounds/${id}`);
        } catch (err) {
            console.error('Error updating campground:', err);
        } finally {
            setLoading(false);
        }
        setValidated(true);
    };

    return (
        <div className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh' }}>
            <div className="w-50">
                <h1 className="mb-4">ערוך מקום אירוח</h1>
                {loading && (
                    <div className="text-center my-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">טוען...</span>
                        </div>
                        <p className="mt-2">מעלה תמונות, אנא המתן...</p>
                    </div>
                )}
                <form className={`row g-3 needs-validation ${validated ? 'was-validated' : ''}`}
                    noValidate
                    validated={validated ? 'true' : undefined}
                    onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">כותרת</label>
                        <input type="text" className="form-control" name='title' value={formData.title} onChange={handleChange} required />
                        <div className="invalid-feedback">
                            יש למלא כותרת.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">תיאור</label>
                        <textarea className="form-control" name='description' value={formData.description} onChange={handleChange} required />
                        <div className="invalid-feedback">
                            יש למלא תיאור.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">מיקום</label>
                        <input type="text" className="form-control" name='location' value={formData.location} onChange={handleChange} required />
                        <div className="invalid-feedback">
                            יש למלא מיקום.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">מחיר עבור לילה</label>
                        <input type="number" className="form-control" name='price' value={formData.price} min={1} onChange={handleChange} required />
                        <div className="invalid-feedback">
                            יש למלא מחיר תקין.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">תמונות קיימות</label>
                        <div className="d-flex flex-wrap gap-2">
                            {formData.images?.map(img => (
                                <div key={img.filename} className="position-relative">
                                    <img src={img.url} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover' }} className="rounded" />
                                    <div className="form-check position-absolute top-0 start-0 bg-light bg-opacity-75 px-1">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={imagesToDelete.includes(img.filename)}
                                            onChange={() => toggleDeleteImage(img.filename)}
                                        />
                                        <label className="form-check-label">מחק</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="form-file custom-file">
                            <label className="form-file-label">
                                <input type="file" className="form-file-input" name='images' multiple onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'שומר...' : 'שמור שינויים'}
                    </button>
                </form>
            </div>
        </div>
    );
}
