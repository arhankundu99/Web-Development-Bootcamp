const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    username: String
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;