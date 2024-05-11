const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
       
    },

});

userSchema.methods.generateAccessToken = function (secretKey) {
    try {
        const token = jwt.sign({
            role: "newuser",
            id: this.id
        },
            secretKey, {
            expiresIn: 60 * 60 * 24 * 30,

        });
        return token;

    } catch (err) {
        console.log(`Error creating JWT token`, err);
        process.exit(1);

    }
};

module.exports = mongoose.model("User", userSchema);