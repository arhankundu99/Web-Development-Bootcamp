//require express
const express = require('express');

//run express function
const app = express();

//to get cookies from the browser, we have to install cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser()); //cookieParser() returns a function

app.get('/greet', (req, res) => {
    const {name = 'No-name'} = req.cookies;
    res.send('Hey there', name);
})

//once we go to this route, open the applications tab in dev tools and we will be able to see the cookies that we sent
app.get('/setname', (req, res) => {
    //send a cookie, first parameter is the key and second parameter is the value
    res.cookie('name', 'henrietta');
    res.cookie('animal', 'harlequin shrimp');
    res.send('SENT YOU A COOKIE!');
});



//get the shelter router
const shelterRouter = require('./routes/shelters');



/*
use the shelter routes (We pass the prefix /shelter)

in shelter router the below path is defined

router.get('/:id', (req, res) => {
    res.send("VIEWING ONE SHELTER");
});

and in the app.use() method, we passed a prefix /shelters

This means that when we go to http://localhost:3000/shelters/325fwe (any id),
the above get method will get fired

*/
app.use('/shelters', shelterRouter);

app.get('/', (req, res) => {
    res.send("ROUTER DEMO");
});


//define port on which the server will start
const port = 3000;

//start up the server
app.listen(port, () => {
    console.log("SERVER RUNNING ON PORT:", port);
})
