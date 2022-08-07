const express = require('express');
const app = express();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const path = require('path');

const User = require('./models/user');

const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//for getting form data 
app.use(express.urlencoded({ extended: true }));

//for sending a cookie (Session ID)
app.use(session({
    secret: 'THIS IS NOT A GOOD SECRET',
    resave: true,
    saveUninitialized: true
}));

//register form get route
app.get('/register', (req, res) => {
    res.render('register');
});

//register form post route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Store hash in your password DB.
        const user = new User({ username, password });

        await user.save();
        return res.redirect('/login');
    }
    catch (err) {
        return res.send(err);
    }
});

//login form get route
app.get('/login', (req, res) => {
    res.render('login');
});

//login form post route
app.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const foundUser = await User.findByUserNameAndValidatePassword(username, password);

        if (foundUser) {
            //store the userId in the session (This id will be used to display pages according to the user who is currently logged in)
            req.session.userID = foundUser._id;
            return res.redirect('/secret');
        }
        return res.send("INVALID CREDENTIALS!");
    }
    catch (err) {
        console.log(err);
        return res.send(err);
    }
});

app.get('/secret', (req, res, next) => {
    //if the user is not logged in, redirect to the login page
    if (!req.session.userID) {

        return res.redirect('/login');
    }

    //else show the secret page
    return res.render('secret');
});

app.post('/logout', (req, res) => {

    //destroy the session
    req.session.destroy();
    return res.redirect('/login');
})

//connect to mongo using mongoose, database name is auth-demo
const mongoPort = 27017;
mongoose.connect(`mongodb://localhost:${mongoPort}/auth-demo`)
    .then(() => console.log("Mongo connection open at port:", mongoPort))
    .catch(err => console.log(err));

const port = 3000;
app.listen(port, () => {
    console.log("Server up and running at port:", port);
})