const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary');
const Campground = require('./campground');
// const passportLocalMongoose = require('passport-local-mongoose');
const Review = require('./review');
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    isAdmin: { type: Boolean, default: false }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
// UserSchema.pre('findOneAndDelete', async function (next) {
//     const user = await this.model.findOne(this.getFilter());
//     if (user) {
//         const campgrounds = await Campground.find({ author: user._id });

//         for (let camp of campgrounds) {
//             for (let img of camp.images) {
//                 if (img.filename) {
//                     await cloudinary.uploader.destroy(img.filename);
//                 }
//             }
//         }
//         await Campground.deleteMany({ author: user._id });
//         await Review.deleteMany({ author: user._id });
//     }

//     next();
// });


// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);