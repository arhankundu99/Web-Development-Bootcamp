const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose'); 
const methodOverride = require('method-override');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmApp')
.then(() => {
    console.log("Mongo connection open!");
})
.catch(err => console.log(err)); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));

app.get('/products', async (req, res) => {
    try{
        const products = await Product.find({});
        res.render('products/index', {products});
    }
    catch(err){
        res.render('error');
        console.log(err);
    }
});

//get a new form to add new products
app.get('/products/new', async(req, res) => {
    res.render('products/new');
});

//add new products in database
app.post('/products', async(req, res) => {
    const {name, price, category} = req.body;
    
    await Product.create({
        name: name,
        price: price,
        category: category
    });

    res.redirect('/products');
});

//update a product
app.get('/products/:id/edit', async(req, res) => {
    const {id} = req.params;
    
    try{
       const product = await Product.findById(id);
       res.render('products/edit', {product});
    }
    catch(err){
        res.render('error');
    }
});

//edit a product in the db
app.put('/products/:id', (req, res) => {
    const {name, price, category} = req.body;
    const {id} = req.params;
    Product.findOneAndUpdate({_id: id}, {
        name: name,
        price: price,
        category: category
    }, {runValidators: true})
    .then((data) => {
        res.redirect('/products');
    })
    .catch((err) => {
        res.send('error');
    })
});

//delete a product in db
app.delete('/products/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);

    Product.deleteOne({_id: id})
    .then((data) => {
        res.redirect("/products");
    })
    .catch((err) => {
        res.send(err);
    })
})

//find a particular product by id
app.get('/products/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const product = await Product.findById(id);
        res.render('products/show', {product});
    }
    catch(err){
        res.render('error');
        console.log(err);
    }
});


app.listen(8080, () => {
    console.log("Listening on port 8080");
});

