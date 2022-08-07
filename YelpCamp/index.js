/*
 * if the environment is development, load the credentials from the .env file
 * For production, we would load the credentials from somewhere else
 */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//require express
const express = require('express');

//get the app object by calling express()
const app = express();

//no need to install path, here path is used to join 2 paths (In case of views directory and public directory)
const path = require('path');

//to generate an unique id
const { v4: uuid } = require('uuid'); 

//for using http verbs other than get or post in html forms
const methodOverride = require('method-override'); 

//for connecting with mongo
const mongoose = require('mongoose');

//for logging every http requests
const morgan = require('morgan'); 

/* for sessions: Sessions are used to store data in server side 
 * to avoid saving any sensitive information in client side through cookies) 
 * Sessions are used to make HTTP stateful (Remember HTTP is stateless)
 */ 
const session = require('express-session'); 

//custom error handling method
const ExpressError = require('./utils/ExpressError');

//require passport for authentication
const passport = require('passport');

//require local strategy (From passport)
const LocalStrategy = require('passport-local');

//require User model
const User = require('./models/user');

/* campgrounds, reviews and user route
 * These routes are defined in separate files
 * to make index.js file less congested
 */ 
const campgroundsRoute = require("./routes/campgrounds");
const reviewsRoute = require('./routes/reviews');
const userRoute = require('./routes/user');

/* set the view engine to ejs (Note that we don't have to require 'ejs', 
 * the below method will automatically require ejs)
 */
app.set('view engine', 'ejs');

/* __dirname is the path where index.js lives
 * if we dont have the below line of code, node will look for the views directory
 * relative to the path where index.js is EXECUTED (Not necessarily where index.js lives).
 * So by executing the below line of code, node will look for the views directory
 * relative to the path where index.js lives. 
 */
app.set('views', path.join(__dirname, 'views')); //views directory

/* Defining a session configuration
 * This session will be used to remember the user who is logged in.
 * This session will expire after a week. So if a user is logged in, 
 * the user will stay logged in for a week even if he closes the browser.
 * Note that the user will stay logged in that browser only. If he goes to 
 * this route in other browser, the cookie is not saved in that browser
 * and he will have to login again
 */ 
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //for more security
        httpOnly: true, 

        //The cookie will expire after a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

/*
 * express.json() returns a function, similarly express.urlencoded(), methodOverride() and session()
 * These functions which are passed in app.use() get executed for every request
 */

//Execute the session() method for every request
app.use(session(sessionConfig));


//log every request in shell
app.use(morgan('tiny')); 

//for getting json data in req.body
app.use(express.json()); 

//for getting form data in req.body
app.use(express.urlencoded({ extended: true }));

//for using http verbs other that GET or POST in html forms
app.use(methodOverride("_method")); 

//for static assets, for every request use public directory (Similar to what we did for views directory)
app.use(express.static(path.join(__dirname, 'public')));

/* TAKEN FROM THE PASSPORT DOCUMENTATION */
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware to remember the user
app.use((req, res, next) => {
    //every response will have the current user details attached to it
    res.locals.currentUser = req.user;
    return next();
})

//connect to mongo using mongoose, database name is yelp-camp
const mongoPort = 27017;
mongoose.connect(`mongodb://localhost:${mongoPort}/yelp-camp`)
    .then(() => console.log("Mongo connection open at port:", mongoPort))
    .catch(err => console.log(err));


//use campground route
app.use("/campgrounds", campgroundsRoute);

//use reviews route
app.use('/campgrounds/:id/reviews', reviewsRoute);

//use user route
app.use('/', userRoute);

//home page
app.get('/', (req, res) => {
    return res.render('campgrounds/home');
});

//add this code at the end. if nothing matches, then sends status code as 404 and 'NOT FOUND' message
app.use((req, res, next) => {
    const statusCode = 404;
    return next(new ExpressError("NOT FOUND", statusCode));
})

//Error handling middleware, any time an error is thrown by one of the route handlers, it is caught here.
app.use((err, req, res, next) => {
    const { message = 'NOT FOUND', statusCode = 404 } = err;
    res.status(statusCode);
    return res.render('error', { message, statusCode })
})

//start up a server on localhost
const port = 3001;
app.listen(port, () => {
    console.log(`SERVER UP AND RUNNING ON PORT: ${port}`);
});