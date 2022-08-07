const express = require('express');
const app = express();

//install express-session
const session = require('express-session');

//for each request, this will send the browser a cookie (The same cookie. And if the cookie is tampered, session expires)
//This cookie is used a key to retrieve data from data store in server side. We have to pass a secret to send a signed cookie
app.use(session({secret: 'This is not a good secret.'}));


app.get('/viewcount', (req, res) => {

    //right now, the default data store is stored in memory store which is not advised for production level code
    //for production app, we can use redis or mongo datastore etc
    if(req.session.count)req.session.count++;
    else req.session.count = 1;

    res.send(`YOU HAVE VIEWED THIS PAGE ${req.session.count} times`);
});

app.listen(3000, () => {
    console.log("LISTENING ON PORT: 3000");
})