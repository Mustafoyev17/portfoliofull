import mongoose from "mongoose";
import bcrypt from "bcrypt"
import isEmail from 'validator/lib/isEmail.js';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password length is 6 character"],
    }
});

userSchema.post('save', (doc, next) => {
    console.log('new user created & saved', doc);
    next();
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.statics.login  = async function (email, password) {
    const user = await this.findOne({ email  });
    if(user) {
        const auth = await bcrypt.compare(
            password, user.password);
            if(auth) {
                return user;
            }
            throw Error('incorrect password');
    }
    throw Error('incorrect email');
 };


 const User = mongoose.model('users', userSchema);

 export default User;