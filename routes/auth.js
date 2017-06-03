var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var router = express.Router();
var User = require('../models').User;

var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(3), null);
}
var isValidPassword = function(userpass, password) {
    return bcrypt.compareSync(password, userpass);
}

// serialize user
passport.serializeUser(function(user, done) {
    done(null, user.id)
})

// deserialize user
passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function(user) {
            if (!user) {
                return done(user.errors, null)
            }
            done(null, user.get());
        })
})

// register
passport.use('local-register', new localStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },

    function(req, username, password, done) {
        req.checkBody('confirmpassword', 'Password does not match').matches(req.body.password);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                return console.log(err)
            }
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
                }).catch(err => console.log(err))
        })
    }
))

// login
passport.use('local-login', new localStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({where: {username: username}})
            .then(function(user) {
                if (!user) {
                    return done(null, false, {message: 'Username doesn\'t exists'})
                }

                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {message: 'Incorrect password'});
                }

                return done(null, user.get());
            })
            .catch(function(err) {
                console.log(err);
                return done(null, false, {message: 'something wrong'})
            })
    }
))

/* GET users listing. */
router.get('/register', function(req, res) {
  res.render('auth/register', {title: 'Register'})
});

router.post('/register', passport.authenticate('local-register', {successRedirect: '/auth/login', failureRedirect: '/auth/register'}));

router.get('/login', function(req, res) {
    res.render('auth/login', {title: 'Login'})
})
router.post('/login', passport.authenticate('local-login', {successRedirect: '/admin/posts', failureRedirect: '/auth/login'}))

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (!err) {
            res.redirect('/auth/login');
        }
    })
})

module.exports = router;