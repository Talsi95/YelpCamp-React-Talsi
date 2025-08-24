const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const verifyToken = require('../middleware/auth');

router.post('/api/campgrounds/:id/reviews', verifyToken, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    await campground.calculateAverageRating();
    res.json(campground);
    // res.status(201).json(review);
});

router.delete('/api/campgrounds/:id/reviews/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    const campground = await Campground.findById(id);
    await campground.calculateAverageRating();

    res.json({ message: 'Review deleted' });
});

module.exports = router;
