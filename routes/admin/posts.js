var router = require('express').Router();
var Category = require('../../models').Category;

router.get('/', (req, res) => {
    
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