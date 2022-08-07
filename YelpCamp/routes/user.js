const express = require('express');
const router = express.Router();

const passport = require('passport');


//all the logic of registering or logging an user will reside in userController (We are following MVC Architechture)
const userController = require('../controllers/user');

/*
 * GET /register: route to register form
 */
router.get('/register', (req, res) => {
    res.render('users/register');
});

/*
 * POST /register: send the registration details to server and redirect
 */
router.post('/register', userController.registerUser);

/*
 * GET /login: route to login form
 */
router.get('/login', userController.renderLoginForm);

/*
 * POST /login: send the login details to server and redirect
 */
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), userController.redirectToIndex);

router.get('/logout', userController.logout);

module.exports = router;

