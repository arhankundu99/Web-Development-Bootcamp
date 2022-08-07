const express = require('express');

//set the mergeParams to true, so that the campgroundID can be extracted in the routes defined below
const router = express.Router({ mergeParams: true });

//require isLoggedIn middleware. this middleware will be used to hide some routes for the users who are not logged in
const { isLoggedIn } = require('../middleware');

const reviewController = require('../controllers/reviews');


//post a review for a specific campground
router.post('/', isLoggedIn, reviewController.validateReview, reviewController.createReview);

//delete a review
router.delete('/:reviewID', isLoggedIn, reviewController.isReviewOwner, reviewController.deleteReview);

module.exports = router;