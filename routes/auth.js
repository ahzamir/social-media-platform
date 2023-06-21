const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.send('Login page');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.send('Logged out');
});

module.exports = router;