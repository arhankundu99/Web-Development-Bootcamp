const bcrypt = require('bcrypt');

//The time taken to create a salt does not depend on the salt rounds. 
//Meaning, the time taken to create a salt with 1 round is same as the time taken to create a salt with 100 rounds
//More the salt rounds, more is the cost of processing the data.
//Ideally recommended value of saltRounds is 12
const saltRounds = 12; 
bcrypt.genSalt(saltRounds, (err, salt) => {
    //console.log(salt); //each time a different salt is generated
});

//generate a hash of the password 'monkey'
//NOTE that the time taken in generating the password grows exponentially with the value of saltRounds 
bcrypt.genSalt(saltRounds, (err, salt) => {
    console.log(salt);
    bcrypt.hash('monkey', salt, (err, hash) => {
        console.log(hash);
    })
});



//compare passwords with the hash
bcrypt.compare('monkey', '$2b$12$a7n.FsJsYtbqjOnT8OieDe2788N6bGduaU9UNA0LB.XnTKGCiEOQm', (err, res) => {
    console.log(res);
})


/* How bcrypt works?
 * Bcrypt generates a unique salt, combines it with the password
 * and generates a hash from (salt + password)
 * Format of the hash: $[algorithm]$[cost]$[salt][hash]
 * Note that the hash is formed for (salt + password)
 * 
 * The compare method works by taking the password, and the hash(from this hash, the salt is extracted),
 * Then hash is generated for (salt + password), and then the generated hash value is compared with the passed hash value
 * /




