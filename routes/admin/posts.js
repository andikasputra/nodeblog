var router = require('express').Router();
var models = require('../../models');
var Post = models.Post;
var Category = models.Category;

router.get('/', (req, res) => {
    Post.findAll({
        include: [{
            model: Category
        }]
    }).then(posts => {
        console.log(posts);
        res.render('admin/posts/index', {title: 'All Posts', posts});
    }).catch(err => {
        console.log(err);
    })
})

router.get('/add', (req, res) => {
    Category.findAll()
        .then(categories => {
            res.render('admin/posts/add', {title: 'Add Posts', categories});
        }).catch(err => {
            console.log(err);
        })
})

module.exports = router;