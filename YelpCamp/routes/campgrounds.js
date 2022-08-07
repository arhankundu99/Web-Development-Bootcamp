//campground route

//require express
const express = require('express');

//get the router
const router = express.Router();

//require isLoggedIn middleware
const { isLoggedIn } = require('../middleware');

/*
 * Multer library is used to parse multipart/form-data forms
 * Here it is used to get the uploaded file data.
 */
const multer = require('multer')

// require the cloudinary storage (In this storage, we will be storing the campground images)
const { storage } = require('../cloudinary/index');

//all the uploaded files will be stored in this destination.
const upload = multer({ storage })

/* require campground controller
 * We are following MVC architecture. We have models, views and controller.
 * The campground controller has the main logic for showing, deleting, adding, updating campground
 */
const campgroundController = require('../controllers/campground');



/* get a form to add a new campground
 * if an user is logged in, then only the user 
 * can add a campground. isLoggedIn middleware is used
 */
router.get('/new', isLoggedIn, campgroundController.renderNewCampgroundForm);

/* make a post request to add new campgrounds
 * after making a post request, validateCampgroundData function will run, 
 * if all the data looks good, then the next middleware will be invoked, 
 * or else the error handler middleware will be invoked
 */
router.post('/', isLoggedIn, upload.array('campgroundImages'), campgroundController.validateCampgroundData, campgroundController.createCampground)

//show a specific campground
router.get('/:id', campgroundController.showSpecificCampground);



//edit a specific campground
router.get('/:id/edit', isLoggedIn, campgroundController.isCampgroundOwner, campgroundController.renderEditCampgroundForm);

//delete a specific campground, This will also trigger the post function defined in the camground.js (models/camground.js) which deletes all the reviews associated with it 
router.delete('/:id', isLoggedIn, campgroundController.isCampgroundOwner, campgroundController.deleteCampground);



//put request for editing a campground
//after making a put request, validateCampgroundData function will run, if all the data looks good, then the next middleware will be invoked, or else the error handler middleware will be invoked

router.put('/:id', isLoggedIn, campgroundController.isCampgroundOwner, campgroundController.validateCampgroundData, campgroundController.editCampground);


//show all campgrounds
router.get('/', campgroundController.index);

//export the router
module.exports = router;