const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/Users')


// @route       POST api/users
// @desc        Register route
// @access      Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('email', 'Please include a valid email').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more charcters').isLength({ min: 6 })
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        // See IF users exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists!" }] });
        }
        //create new user object
        user = new User({
            email,
            password
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        // saving the data to database
        await user.save();

        const payload = {
            user: {
                id: user.id,

            }
        }
        // expiresIn change it back to 3600 when in production
        jwt.sign(payload, config.get('jwtUsersToken'), { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;
                res.json({ token })
            });



    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }




});

module.exports = router;