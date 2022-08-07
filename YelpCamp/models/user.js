const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

/* plug in the passport with the schema
 * According to the docs, it will add in a username, salt and the hashed password.
 * Additionally, it also adds some methods to the schema (See documentation
 * for more details)
 */
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;