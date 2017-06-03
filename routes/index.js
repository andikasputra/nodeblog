var express = require('express');
var router = express.Router();

var models = require('../models');
var Post = models.Post;
var Category = models.Category;
var User = models.User;

Date.prototype.postDate = function() {
	const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	return `${month[this.getMonth()]} ${this.getDate()}, ${this.getFullYear()}`
}
/* GET home page. */
router.get('/', (req, res) => {
	Post.findAll({
		include: [
			{model: Category},
			{model: User}
		]
	}).then(posts => {
		Category.findAll()
			.then(categories => {
				res.render('index', {
					title: 'All Posts', 
					category: false,
					categories,
					posts
				});
			}).catch(err => console.log(err))
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
		Category.findAll()
			.then(categories => {
				res.render('single', {
					title: post.dataValues.title, 
					categories,
					post: post.dataValues
				})
			}).catch(err => console.log(err))
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
		Category.findAll()
		.then(categories => {
			res.render('index', {
				title: category.dataValues.name, 
				category: category.dataValues, 
				posts: category.dataValues.Posts,
				categories
			});
		}).catch(err => console.log(err))
	})
})

module.exports = router;
