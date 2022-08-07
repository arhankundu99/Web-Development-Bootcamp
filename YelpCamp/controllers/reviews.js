const Campground = require('../models/campground');
const Review = require('../models/review');

//function to validate reviews
module.exports.validateReview = (req, res, next) => {
    const { body } = req.body;
    if (!body) return next("Review cannot be empty");
    return next();
}

module.exports.createReview = (req, res, next) => {
    const { id } = req.params;
    Campground.findById(id)
        .then(async (campground) => {
            const { rating, body } = req.body;
            const review = new Review({
                rating,
                body,
                username: res.locals.currentUser.username
            });

            await review.save();
            campground.reviews.push(review);

            campground.save()
                .then((data) => {
                    //console.log(data)
                    res.redirect(`/campgrounds/${id}`)
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

module.exports.deleteReview = async (req, res, next) => {
    const campgroundID = req.params.id;
    const { reviewID } = req.params;
    //console.log(campgroundID);
    try {
        await Review.findByIdAndDelete(reviewID);
        const campground = await Campground.findById(campgroundID);
        campground.reviews = campground.reviews.filter((r) => r !== reviewID);
        await campground.save();
        res.redirect(`/campgrounds/${campgroundID}`);
    }
    catch (err) {
        return next(err);
    }
}


module.exports.isReviewOwner = async(req, res, next) => {
    const {reviewID} = req.params;

    try{
        const review = await Review.findById(reviewID);

        if(!review){
            return next(new ExpressError("This review does not exist", 404));
        }
        
        //The logged in user cannot get access to the edit form if the user is not authorized
        if(res.locals.currentUser.username !== review.username){
            return next(new ExpressError("You are not authorized to do this action", 200));
        }
        return next();
    }

    catch(e){
        return next(new ExpressError(e, 404));
    }
}