/* This code is used to fill
 * the database with random data and random images
 * Execute this when you are running the project for the first time
 */  

 /*
 * if the environment is development, load the credentials from the .env file
 * For production, we would load the credentials from somewhere else
 */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//for connecting mongo with node
const mongoose = require('mongoose');

const axios = require('axios').default;

//require the campground model
const Campground = require('../models/campground');

//get the dummy data
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

//connect to mongo using mongoose, database name is yelp-camp
const mongoPort = 27017;
mongoose.connect(`mongodb://localhost:${mongoPort}/yelp-camp`)
.then(() => console.log("Mongo connection open!"))
.catch(err => console.log(err)); 

//returns a random element from the input array
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    //delete all data from the Campground collection initially
    await Campground.deleteMany({}); 
    const unsplashAPI = `https://api.unsplash.com/photos/random?query=campground&count=30&client_id=${process.env.UNSPLASH_API_KEY}`

    const unsplashAPIResponse = await axios.get(unsplashAPI);
    
    for(let i = 0; i < 30; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        
        const campgroundImageURL = unsplashAPIResponse["data"][i]["urls"]["full"];
        const images = [{url: campgroundImageURL}]
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images,
            price: Math.random() * 100 + 1,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur hic iusto atque, consectetur possimus ratione distinctio ducimus autem vitae quaerat dolore magnam sunt adipisci quae aliquam explicabo delectus laborum nulla',
            username: 'akundu1',
            latitude: cities[random1000].latitude,
            longitude: cities[random1000].longitude
        });
        await camp.save();
    }
}

seedDB()
.then(() => {
    //close this connection
    mongoose.connection.close(); 
})
.catch(err => console.log(err));

