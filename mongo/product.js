//Install mongoose package using npm i mongoose
const mongoose = require('mongoose'); 

//The default port for mongoDB is 27017 as defined in
//https://www.mongodb.com/docs/manual/reference/default-mongodb-port/

//here shopApp is the collection name that we are going to use. If it does not exist, it will create a new collection with name shopApp
//the following line returns a promise
mongoose.connect('mongodb://localhost:27017/shopApp')
.then(() => console.log("Connection open!"))
.catch(err => console.log("Oops", err)); 


//But we can write the schema as below which allows us to add more properties or validations

const productSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        lowercase: true, //if name is "BIKE", then it will get saved as "bike"
        trim: true, //"  BiKE  " will be saved as "bike"
        maxLength: 20 //Name should have maxLength of 20
    },
    price: {
        type: 'number',
        required: true,  //required means this field cannot be empty
        min: [20, 'price must be greater >= 20'] //minimum price should be 20 and if it is not, then the error msg which is defined in the second element will be shown
    },
    onSale: {
        type: 'boolean',
        default: false //if this parameter is not included in document, it would have a default value of false
    },
    categories: {
        type: [String] //categories is an array of strings
    },
    qty: { //nested 
        online: {
            type: 'number',
            default: 0
        },
        inStore: {
            type: 'number'
        }
    },
    size: {
        type: 'string',
        enum: ['S', 'M', 'L', 'XL'] //the size should be one of the values from this array
    }
});


productSchema.methods.greet = function(){
    console.log("Hello");
    console.log(`${this.name}`);
}

productSchema.methods.toggleOnSale = function(){
    this.onSale = !this.onSale;
    this.save(); //after toggling, save in db
}


const Product = mongoose.model('Product', productSchema);

productSchema.statics.fireSale = function(){
    //this does not refer to the instance or object
    //this refers to the model class
    //The reason we did not use the below line is because we do not want to hardcode the model name
    //Product.updateMany({}, {onSale: true, price: 0});
    return this.updateMany({}, {onSale: true, price: 0});
}
console.log(Product.fireSale());


const bike = new Product({name: 'Mountain Bike', price: 25});


bike.greet();
bike.toggleOnSale();

// bike.save()
// .then(data => console.log(data))
// .catch(err => console.log(err));

//Product.deleteOne({});