const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
// const User = require('../models/user');
// const catchAsync = require('../utils/catchAsync');
// const { isLoggedIn, isAdmin, isAuthor, validateCampground } = require('../middleware');
const { cloudinary } = require('../cloudinary');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const verifyToken = require('../middleware/auth');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.json(campgrounds);
});

router.get('/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');
    res.json(campground);
});

router.post('/', verifyToken, upload.array('images'), async (req, res) => {
    try {
        const { title, description, location, price } = req.body;
        const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });

        const campground = new Campground({
            title,
            description,
            location,
            price,
            author: req.user._id,
            images: req.files.map(f => ({ url: f.path, filename: f.filename })),
            geometry: geoData.features[0].geometry
        });

        await campground.save();
        res.status(201).json(campground);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating campground' });
    }
});

router.put('/:id', verifyToken, upload.array('images'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, price, deleteImages } = req.body;

        const campground = await Campground.findById(id);
        if (!campground) {
            return res.status(404).json({ error: 'Campground not found' });
        }

        // בדיקת הרשאות
        if (campground.author.toString() !== req.user._id) {
            return res.status(403).json({ error: 'אין לך הרשאה לערוך את מקום האירוח הזה' });
        }

        // עדכון שדות בסיסיים
        campground.title = title || campground.title;
        campground.description = description || campground.description;
        campground.price = price || campground.price;

        // עדכון מיקום + geometry
        if (location && location.trim() !== '' && location !== campground.location) {
            console.log(`Updating location from "${campground.location}" to "${location}"`);

            try {
                const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });

                if (geoData?.features?.length > 0) {
                    campground.location = location;
                    campground.geometry = geoData.features[0].geometry;
                    console.log('Geometry updated successfully.');
                } else {
                    console.warn(`Geocoding failed for location: "${location}". No geometry data returned.`);
                }
            } catch (geocodingErr) {
                console.error('Error during geocoding:', geocodingErr);
            }
        }

        // הוספת תמונות חדשות
        if (req.files && req.files.length > 0) {
            const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
            campground.images.push(...imgs);
        }

        // מחיקת תמונות שנבחרו למחיקה
        if (deleteImages) {
            const deleteArray = Array.isArray(deleteImages) ? deleteImages : [deleteImages];
            for (let filename of deleteArray) {
                await cloudinary.uploader.destroy(filename);
            }
            campground.images = campground.images.filter(img => !deleteArray.includes(img.filename));
        }

        await campground.save();
        res.json(campground);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating campground' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            return res.status(404).json({ error: 'Campground not found' });
        }

        if (campground.author.toString() !== req.user._id) {
            return res.status(403).json({ error: 'אין לך הרשאה למחוק את מקום האירוח הזה' });
        }

        await Campground.findByIdAndDelete(req.params.id);

        res.json({ message: 'Campground נמחק בהצלחה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});


module.exports = router;