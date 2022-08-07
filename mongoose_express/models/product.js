const mongoose = require('mongoose');

//make a schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable', 'dairy'],
        lowercase: true
    }
});

//make a model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;