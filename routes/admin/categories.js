var router = require('express').Router();
var Category = require('../../models').Category;

router.get('/', (req, res) => {
    Category.findAll()
        .then(categories => {
            res.render('admin/categories/index', {title: 'All Categories', categories: categories});
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/add', (req, res) => {
    res.render('admin/categories/add', {title: 'Add Category'});
})

router.post('/add', (req, res) => {
    req.checkBody('name', 'category name is required').notEmpty();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            return console.log(result)
        }

        var slug = req.body.name.replace(' ','-').toLowerCase();
        Category.create({
            name: req.body.name,
            description: req.body.description,
            slug: slug
        }).then(category => {
            res.redirect('/admin/categories');
        }).catch(err => {
            console.log(err)
        })
    })
})

router.get('/:id/edit', (req, res) => {
    Category.findById(req.params.id)
        .then(category => {
            res.render('admin/categories/edit', {title: 'Edit Category', category: category.dataValues})
        }).catch(err => {
            console.log(err);
        })
})

router.put('/:id/edit', (req, res) => {
    req.checkBody('name', 'category name is required').notEmpty();
    req.checkParams('id', 'Category id must a number').isNumeric();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            return console.log(result)
        }

        Category.update({
            name: req.body.name,
            description: req.body.description,
            slug: req.body.name.replace(' ', '-').toLowerCase()
        }, {
            where: {
                id: req.params.id
            }
        }).then(category => {
            res.redirect('/admin/categories');
        }).catch(err => {
            console.log(err);
        })
    })
})

router.get('/:id/delete', (req, res) => {
    req.checkParams('id', 'category id must a number').isNumeric();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            console.log(result);
        }

        Category.destroy({where: {id: req.params.id}})
            .then(category => {
                res.redirect('/admin/categories');
            }).catch(err => {
                console.log(err);
            })
    })
})

module.exports = router;