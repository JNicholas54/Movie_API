// Create a /login endpoint for registered users that contains logic for authenticating users with basic HTTP authentication and generating aJWT token for authentiating future requests

const jwtSecret = 'your_jwt_secret'; //This has to be the same key used in JWTStrategy!!!!
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport'); // the local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // this is the usename you are encoding in the JWT
        expiresIn: '7d', // this specifies that the token will expire in 7 days
        algorithm: 'HS256' // this is the algorithm used to 'sign' or encode the values of JWT
    });
}

// POST login
module.exports = (router) => {
    router.use(passport.initialize());
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something isn\'t right...',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
};