import { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import { toast } from 'react-toastify';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = {
    1: { icon: <SentimentVeryDissatisfiedIcon color="error" />, label: 'מאוד לא מרוצה' },
    2: { icon: <SentimentDissatisfiedIcon color="error" />, label: 'לא מרוצה' },
    3: { icon: <SentimentSatisfiedIcon color="warning" />, label: 'נייטרלי' },
    4: { icon: <SentimentSatisfiedAltIcon color="success" />, label: 'מרוצה' },
    5: { icon: <SentimentVerySatisfiedIcon color="success" />, label: 'מאוד מרוצה' },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

export default function ReviewForm({ campgroundId, onReviewAdded }) {
    const [review, setReview] = useState({ body: '', rating: 5 });
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError('');

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('אינך מחובר, יש להתחבר כדי לשלוח תגובה');
                return;
            }

            await axios.post(`/api/campgrounds/${campgroundId}/reviews`,
                { review },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReview({ body: '', rating: 5 });
            onReviewAdded();
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('ההרשאה נדרשת — אנא התחבר מחדש');
            } else {
                setError('אירעה שגיאה בעת שליחת התגובה');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
                <label>דירוג</label>
                <StyledRating
                    dir='ltr'
                    name="highlight-selected-only"
                    value={review.rating}
                    onChange={(e, newValue) => setReview({ ...review, rating: newValue })}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
            </div>
            <div className="mb-3">
                <label>השאר תגובה</label>
                <textarea
                    className="form-control"
                    value={review.body}
                    onChange={(e) => setReview({ ...review, body: e.target.value })}
                />
            </div>
            <button className="btn btn-primary">שלח תגובה</button>
            {error && <p className="text-danger mt-2">{error}</p>}
        </form>
    );
}
