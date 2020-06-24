const mongoose = require('mongoose');
const crypto = require('crypto');
const uuid1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
        maxlength: 10,
    },
    country: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    encry_password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuid1();
        this.encry_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    securePassword: function (plainPassword) {
        if (!plainPassword) {
            return "";
        }
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');

        } catch (error) {
            return "";
        }
    },
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password;
    }
}

module.exports = mongoose.model("User", userSchema);