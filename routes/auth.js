var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var router = express.Router();
var User = require('../models').User;

var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(3), null);
}

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function(user) {
            if (!user) {
                return done(user.errors, null)
            }
            done(null, user.get());
        })
})

passport.use('local-register', new localStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },

    function(req, username, password, done) {
        User.findOne({where: { username: username}})
            .then(function(user) {
                if (user) {
                    return done(null, false, { message: 'username already taken'})
                } else {
                    var userpass = generateHash(password);
                    var data = {
                        username: username,
                        email: req.body.email,
                        fullname: req.body.fullname,
                        password: userpass
                    }

                    User.create(data)
                        .then(function(newUser, created) {
                            if (!newUser) {
                                return done(null, false)
                            }
                            return done(null, newUser);
                        })
                }
            })
    }
))

/* GET users listing. */
router.get('/register', function(req, res) {
  res.render('auth/register', {title: 'Register'})
});

router.post('/register', passport.authenticate('local-register', {successRedirect: '/', failureRedirect: '/auth/register'}));

router.get('/login', function(req, res) {
    res.render('auth/login', {title: 'Login'})
})

module.exports = router;