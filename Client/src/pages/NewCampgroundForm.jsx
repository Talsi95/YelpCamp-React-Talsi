import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';


export default function NewCampgroundForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        images: ''
    });

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
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

            for (let i = 0; i < formData.images.length; i++) {
                formDataToSend.append('images', formData.images[i]);
            }
            const res = await axios.post('/api/campgrounds', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('מקום אירוח נוסף בהצלחה');
            // alert('Campground created successfully!');
            navigate(`/campgrounds/${res.data._id}`);
        } catch (err) {
            console.error('Error creating campground:', err);
        } finally {
            setLoading(false);
        }
        setValidated(true);
    }

    return (
        <div className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh' }}>
            <div className="w-50">
                <h1 className="mb-4">הוסף מקום אירוח חדש</h1>
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
                        <input type="number" className="form-control" name='price' value={formData.price} onChange={handleChange} min={1} required />
                        <div className="invalid-feedback">
                            יש למלא מחיר תקין.
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
                        {loading ? 'מוסיף מקום...' : 'הוסף מקום'}
                    </button>
                </form>
            </div>
        </div>
    );
}
