const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

//Importing controllers
const { signout, signup, signin, isSignedIn } = require('../controllers/auth');

//Routes Added here
router.get("/signout", signout);

router.post("/signup", [
    check('firstname', "first name should be at least 5 characters").isLength({ min: 5 }),
    check('lastname', "last name should be at least 5 characters").isLength({ min: 5 }),
    check('username', "user name should be at least 5 characters").isLength({ min: 4 }),
    check('email', "email is required")
        .isEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exist');
                }
            });
        })
        .normalizeEmail(),
    check('password', 'password should be at least 6 characters').isLength({ min: 6 })
], signup);

router.post("/signin", [
    check('email', "email is required").isEmail(),
    check('password', 'password field is required').notEmpty().isLength({min: 1})
], signin);


module.exports = router;