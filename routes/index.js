var express = require('express');
var router = express.Router();

var models = require('../models');
var Post = models.Post;
var Category = models.Category;
var User = models.User;

/* GET home page. */
router.get('/', (req, res) => {
	Post.findAll({
		include: [
			{model: Category},
			{model: User}
		]
	}).then(posts => {
		res.render('index', {
			title: 'All Posts', 
			category: false, 
			posts
		});
	}).catch(err => {
		console.log(err);
	})
});

router.get('/post/:slug', (req, res) => {
	Post.findOne({
		where: {
			slug: req.params.slug
		},
		include: [
			{model: Category},
			{model: User}
		]
	}).then(post => {
			res.render('single', {
				title: post.dataValues.title, 
				post: post.dataValues
			})
	}).catch(err => console.log(err))
})

router.get('/category/:slug', (req, res) => {
	Category.findOne({
		where: {
			slug: req.params.slug
		},
		include: [
			{model: Post}
		]
	}).then(category => {
		res.render('index', {
			title: category.dataValues.name, 
			category: category.dataValues, 
			posts: category.dataValues.Posts
		});
	})
})

module.exports = router;
