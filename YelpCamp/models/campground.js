const mongoose = require('mongoose');
const Review = require('./review');

/* create the campground schema
 * As the campground can have many reviews, it is one to many relationship
 * In campground schema, we are referencing the reviews (i.e, We are storing the ids of the reviews
 * in the schema)
 */

const CampgroundSchema = new mongoose.Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    price: {
        type: Number,
        min: 1
    },
    description: String,
    location: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    username: String,
    latitude: Number,
    longitude: Number
});

// After we delete the campground, we would also have to delete the reviews associated with it
CampgroundSchema.post('findOneAndDelete', async (deletedCampground) => {
    await Review.remove({
        _id: {
            $in: deletedCampground.reviews
        }
    })
})

//create a model
const Campground = mongoose.model('Campground', CampgroundSchema);

//export this model
module.exports = Campground;