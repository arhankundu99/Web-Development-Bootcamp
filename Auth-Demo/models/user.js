const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
    },
    password: {
        type: String,
        required: true
    }
});

//adding a static method to validate the credentials
userSchema.statics.findByUserNameAndValidatePassword = async(username, password) => {
    const foundUser = await User.findOne({username});
    if(!foundUser)return false;

    const validPassword = await bcrypt.compare(password, foundUser.password);
    return !validPassword? false: foundUser;
}

//pre method: The callback function will be called before user.save()
userSchema.pre('save', async(next) => {
    const saltRounds = 12;
    this.password =  await bcrypt.hash(password, saltRounds);
    next();
})

const User = mongoose.model('User', userSchema);



module.exports = User;