const Campground = require('../models/campground');
//require the express error
const ExpressError = require('../utils/ExpressError');

//require axios to make http requests
const axios = require('axios').default;

module.exports.index = (req, res, next) => {
    Campground.find({})
        .then((campgrounds) => {
            return res.render('campgrounds/index', { campgrounds });
        })
        .catch((err) => {
            return next(new ExpressError(err.message, 400));
        })
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    //get the image links from the multer
    const images = req.files.map(f => { return { url: f.path, filename: f.filename } });

    const { title, location, price, description } = req.body;

    try {
        await Campground.findByIdAndUpdate(id, {
            title: title,
            location: location,
            images,
            price,
            description
        }, { runValidators: true });

        res.redirect(`/campgrounds/${id}`);
    }
    catch (err) {
        //always return next() so that the code below next() does not execute after next() is executed
        return next(new ExpressError(err.message, 400));
    }
}

module.exports.deleteCampground = (req, res, next) => {
    const { id } = req.params;

    Campground.findByIdAndDelete(id)
        .then(() => res.redirect('/campgrounds'))
        .catch((err) => next(new ExpressError(err.message)));
}

module.exports.showSpecificCampground = async (req, res, next) => {
    const { id } = req.params;

    try {

        let campground = await Campground.findById(id).populate('reviews');
        res.render('campgrounds/show', { campground });
    }
    catch (err) {
        //always return next() so that the code below next() does not execute after next() is executed
        return next(new ExpressError(err.message, 404));
    }
}

module.exports.createCampground = async (req, res, next) => {
    //get the image links from the multer
    const images = req.files.map(f => { return { url: f.path, filename: f.filename } });

    const { title, location, price, description } = req.body;


    //get the latitude and longitude from the new camground location
    const locationRequestURL = `https://geocoder.ls.hereapi.com/6.2/geocode.json?searchtext=${location}&&gen=9&apiKey=${process.env.HERE_MAPS_API_KEY}`;

    const locationResponse = await axios.get(locationRequestURL);
    const locationCoordinates = locationResponse["data"]["Response"]["View"][0]["Result"][0]["Location"]["DisplayPosition"];
    console.log(locationCoordinates);
    try {
        const campground = new Campground({
            title,
            location,
            images,
            price,
            description,
            username: res.locals.currentUser.username,
            latitude: locationCoordinates.Latitude,
            longitude: locationCoordinates.Longitude
        });

        campground.save()
            .then(() => res.redirect(`campgrounds/${campground._id}`))
            .catch((err) => {
                //As this is an asynchronous function, we have to explicitly call next() 
                //and pass on the error so that it can be caught by the error handling middleware functions
                return next(new ExpressError(err.message, 400));

            });
    }
    catch(err){
        return next(new ExpressError(err.message), 400);
    }
}

module.exports.renderNewCampgroundForm = (req, res) => {

    //render views/campgrounds/new.js
    return res.render('campgrounds/new');
}

module.exports.renderEditCampgroundForm = async (req, res, next) => {
    const { id } = req.params;

    try {
        const campground = await Campground.findById(id);
        return res.render('campgrounds/edit', { campground });
    }
    catch (err) {
        //always return next() so that the code below next() does not execute after next() is executed
        return next(new ExpressError(err.message, 404));
    }
}

//function to validate campground data
module.exports.validateCampgroundData = function validateCampgroundData(req, res, next) {

    const { title, location, price, description } = req.body;
    const images = req.files;

    //check if any of the fields are undefined
    if (!(title && location && images && price && description))
        return next(new ExpressError("Some Fields are empty!", 400));

    else return next();
}


module.exports.isCampgroundOwner = async (req, res, next) => {
    const { id } = req.params;

    try {
        const campground = await Campground.findById(id);

        if (!campground) {
            return next(new ExpressError("This campground does not exist", 404));
        }
        //The logged in user cannot get access to the edit form if the user is not authorized
        if (res.locals.currentUser.username !== campground.username) {
            return next(new ExpressError("You are not authorized to do this action", 200));
        }
        return next();
    }

    catch (e) {
        return next(new ExpressError(e, 404));
    }
}

