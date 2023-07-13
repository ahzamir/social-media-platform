const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/postRoutes');

connectDB();

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use('/', postRoutes);

app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
});

app.listen(3000, () => {
    console.log('Server running on port 5000!');
});