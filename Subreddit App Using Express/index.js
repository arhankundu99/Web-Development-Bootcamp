const express = require('express'); //searches for this package in node_modules directory
const path = require('path'); //no need to install the path package, this package comes with node
const data = require('./data.json'); //searches for data.json in the directory where index.js lives

const app = express(); 

app.set('view engine', 'ejs'); //we are not requiring ejs. This line will internally require ejs from node_modules directory

app.set('views', path.join(__dirname, 'views')); //This is required because if we don't do this, 
//when we try to run index.js from any other directory, node will 
//look for views folder in that directory instead of the directory where index.js lives
//__dirname is the absolute path of the directory where index.js lives

//and doing the same with public folder for static assets
app.use(express.static(path.join(__dirname, 'public'))); //all the static files will be searched here

//sending response for homepage
app.get('/', (req, res) => {
    res.render('home'); //node is going to look for home.ejs in the views folder
});

//sending response for subreddits
app.get('/r/:subreddit', (req, res) => {
    const {subreddit} = req.params; //req.params is an object, destructing the value of subreddit from that object

    if(data[subreddit]){
        res.render('subreddit', {...data[subreddit]}); //passing data to subreddit.ejs file (Should pass an object)
    }
    else res.render('badRequest'); //node is going to look for badRequest.ejs in views folder
})


//for any other requests:
//(Remember: this code has to be below every other get request or else every time this code only will be fired)
app.get('*', (req, res) => {
    res.render('badRequest'); //node is going to look for badRequest.ejs in views folder
});

//start up a server
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});