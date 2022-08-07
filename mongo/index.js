//Install mongoose package using npm i mongoose
const mongoose = require('mongoose'); 

//The default port for mongoDB is 27017 as defined in
//https://www.mongodb.com/docs/manual/reference/default-mongodb-port/

//here movieApp is the collection name that we are going to use. If it does not exist, it will create a new collection with name movieApp
//the following line returns a promise
mongoose.connect('mongodb://localhost:27017/movieApp')
.then(() => {
    console.log("Connection open!");
    /*We may think that after connecting with mongo,
    all the insert, update, delete, find etc operations should be done IN THIS CALLBACK
    (as of now we are doing these operations outside).

    What happens is mongo uses OPERATION BUFFERING. It ensures that all these operations are done after connecting to mongoDB
    So we can write our code outside this callback
    */
})
.catch(err => console.log("Oops", err)); 


//For models, refer this: https://mongoosejs.com/docs/models.html
//Models are basically classes from which documents are defined. Models are used for creating and reading documents from MongoDB database.

//schema defines how the data in the document will look like (defines the structure of the data in a document)

//create a schema
const movieSchema = new mongoose.Schema({
    title: 'string',
    year: 'number',
    score: 'number',
    rating: 'string'
});

//create a model
//The first argument is the collection name and the second argument is the schema
const Movie = mongoose.model('Movie', movieSchema);

//return all the movies whose year >= 2010
Movie.find({year: {$gte: 2010}})
.then(data => console.log(data));

//res does not contain the updated data, it contains the acknowledgement info whether the updation was successful or not
Movie.updateOne({title: 'Amadeus'}, {year: 1984})
.then(res => console.log(res));

Movie.updateMany({title: {$in: ['Amadeus', 'Stand By Me']}}, {score: 10})
.then((data) => console.log(data));


//deleting
Movie.remove({title: 'Amelie'})
.then((msg) => console.log(msg));

//deleteMany
Movie.deleteMany({year: {$gte: 1999}})
.then((msg) => console.log(msg));
