const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    //check if an user is logged in
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    return next();
}
