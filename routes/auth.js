var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/register', function(req, res) {
  res.render('auth/register', {title: 'Register'})
});

router.get('/login', function(req, res) {
    res.render('auth/login', {title: 'Login'})
})

module.exports = router;