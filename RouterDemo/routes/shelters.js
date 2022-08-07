const express = require('express');
const router = express.Router();

//lets say, we want to run this middleware every time we get a request to the shelter route 
const verifyAdmin = (req, res, next) => {
    const {isAdmin} = req.query;
    if(!isAdmin)return res.send('SORRY! NOT AN ADMIN');

    return next(); //remember returning next() is a good practice because generally we dont want any code to execute after next()

}

/*WE HAVE 2 choices:
first choice: Include this middleware in every route

router.get('/', verifyAdmin, (req, res) => {
    res.send("ALL SHELTERS");
});

router.get('/:id', verifyAdmin, (req, res) => {
    res.send("VIEWING ONE SHELTER");
});

router.get('/:id/edit', verifyAdmin, (req, res) => {
    res.send("EDITING THE SHELTER");
});

router.post('/', verifyAdmin, (req, res) => {
    res.send("CREATING ONE SHELTERS");
});

ELSE, write a app.use() method where we pass in the middleware and it will execute every time a request comes to the shelter route

*/

router.use(verifyAdmin);

router.get('/', (req, res) => {
    res.send("ALL SHELTERS");
});

router.get('/:id', (req, res) => {
    res.send("VIEWING ONE SHELTER");
});

router.get('/:id/edit', (req, res) => {
    res.send("EDITING THE SHELTER");
});

router.post('/', (req, res) => {
    res.send("CREATING ONE SHELTERS");
});

//export the router
module.exports = router;




