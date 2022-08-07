const User = require('../models/user');
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');

module.exports.registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        //make a new user
        const user = new User({ email, username });

        /* User.register takes the user and the password, makes a hash of the password
         * and saves the user in the database along with the salt and the password
         * No need for user.save()
         */
        const registeredUser = await User.register(user, password);
        //console.log(registeredUser);
        res.redirect('/login');
    }
    catch (e) {
        next(new ExpressError(500, e));
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.redirectToIndex = (req, res) => {
    res.redirect('/campgrounds');
}

module.exports.logout = async (req, res) => {
    await req.logout((err) => {
        if(err) return next(err);
    });
    return res.redirect('/campgrounds');
}