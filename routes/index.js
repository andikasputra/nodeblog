var express = require('express');
var router = express.Router();

var models = require('../models');
var Post = models.Post;
var Category = models.Category;
var User = models.User;

/* GET home page. */
router.get('/', function(req, res, next) {
		Post.findAll({
				include: [
						{model: Category},
						{model: User}
				]
		}).then(posts => {
				console.log(posts);
				console.log(posts[0].dataValues)
				res.render('index', {title: 'All Posts', posts});
		}).catch(err => {
				console.log(err);
		})
});

module.exports = router;
