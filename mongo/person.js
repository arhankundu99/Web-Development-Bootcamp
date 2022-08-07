//Install mongoose package using npm i mongoose
const mongoose = require('mongoose'); 

//The default port for mongoDB is 27017 as defined in
//https://www.mongodb.com/docs/manual/reference/default-mongodb-port/

//here shopApp is the collection name that we are going to use. If it does not exist, it will create a new collection with name shopApp
//the following line returns a promise
mongoose.connect('mongodb://localhost:27017/shopApp')
.then(() => console.log("Connection open!"))
.catch(err => console.log("Oops", err)); 

const personSchema = new mongoose.Schema({
    first: String,
    last: String
});

//the callback will run before the save method.
personSchema.pre('save', async function(){
    console.log("ABOUT TO SAVE!!!")
});

//the callback will run after the save method
personSchema.post('save', async function(){
    console.log("JUST SAVED!!!")
});
const Person = mongoose.model('Person', personSchema);

const k = new Person({first: 'Kristen', last: 'Sun'});
k.save()