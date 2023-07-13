const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    }
});

userSchema.pre(
    "save",
    async function (next) {
        const user = this;
        if (!user.isModified("password")) {
            return next();
        }
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            })
        })
    }
);

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = password === user.password;

    return compare;
}

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;