const express = require('express');
const path = require('path');
const methodOverride = require('method-override'); //method-override package lets us use patch, put and other http verbs where client does not support it (In html, forms only support get and post)
const {v4: uuid} = require('uuid'); //uuid() will give us an unique id

const app = express();

app.set('view engine', 'ejs'); //setting the view engine to ejs
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); //for parsing form data
app.use(methodOverride("_method"));

let comments = [
    {
        id: uuid(),
        username: 'Todd',
        comment: 'lol that is so funny'
    },
    {
        id: uuid(),
        username: 'Skyler',
        comment: 'I like to go birdwatching with my dog'
    },
    {
        id: uuid(),
        username: 'Sk8erBoi',
        comment: 'Plz delete your account, Todd'
    },
    {
        id: uuid(),
        username: 'onlysayswoof',
        comment: 'woof woof woof'
    }
];

//homepage
app.get('/', (req, res) => {
    res.render('home');
});

//getting all the comments
app.get('/comments', (req, res) => {
    res.render('comments/comments', {comments}); //index.ejs shows all the comments
});

//render adding a new comment page
app.get('/comments/new', (req, res) => {
    res.render('comments/new'); //new.ejs shows the form to submit a new comment
});

//get one specific comment details
app.get('/comments/:id', (req, res) => {
    const {id} = req.params;

    const comment = comments.find((comment) => comment.id === id);

    res.render('comments/show', {comment});
});

//edit a specific comment
app.get('/comments/:id/edit', (req, res) => {
    const {id} = req.params;

    const comment = comments.find((comment) => comment.id === id);

    res.render('comments/edit', {comment});
});

/*  HTTP verb: PATCH
    PATCH is used to make partial modifications to a resource: (In this case we are only making changes to the comment text 
    and not the username). So we should do this in PATCH request.

    HTTP verb: PUT
    PUT is used to modify the whole resource with the information recieved in the payload

    (payload means the data we send to the server with verbs like post, patch, put etc)

    See, we can still use post request for this but it is generally a good idea to follow the guidelines
*/

//We are using method-override package to send patch request. (Originally we are sending a post request in html forms, but using method-override, we are overriding with a PATCH request) 
app.patch('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find((comment) => comment.id === id);
    comment.comment = req.body.newCommentText;

    res.redirect('/comments'); //redirect back to comments page (just like post request)
});

//delete a comment
app.delete('/comments/:id', (req, res) => {
    const {id} = req.params;

    comments = comments.filter((comment) => comment.id !== id);

    res.redirect('/comments'); //redirect back to comments page (just like post request);
})

//creating a new comment
/*in this post method, we send 2 requests:
1) POST REQUEST to /comments
2) REDIRECT (GET REQUEST) to /comments
*/
app.post('/comments', (req, res) => {
    const {username, comment} = req.body;

    const id = uuid();
    comments.push({id, username, comment});

    //why are we redirecting to /comments 
    //instead of res.render('comments/comments', {comments});

    //because in post request, when you refresh (A form resubmission alert is given), and if we press ok,
    //we again send the post request with the previous data
    //to prevent that, we use the redirect method (which sends a get resquest to /comments)
    res.redirect('/comments'); //it will include a status code of 302
});

app.listen(3000, (req, res) => {
    console.log("Listening on port 3000!");
});
 