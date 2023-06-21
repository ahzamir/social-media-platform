const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
const User = require('./models/user');
passport.use(new passportLocal({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect email.' });
        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
        })
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

app.use('/', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000!'));

