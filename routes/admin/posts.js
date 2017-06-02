var router = require('express').Router();
var multer = require('multer');
var path = require('path');

var models = require('../../models');
var Post = models.Post;
var Category = models.Category;
var User = models.User;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/image/');
    },
    filename: (req, file, cb) => {
        if (file)
            cb(null, req.body.title.replace(/ |?/g, '-').toLowerCase()+path.extname(file.originalname));
    }
})

const upload = multer({storage});

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
    if (mm < 10) {
        mm = '0' + mm;
    }

    return `${this.getFullYear()}-${mm}-${dd}`
}

router.get('/', (req, res) => {
    Post.findAll({
        include: [
            {model: Category},
            {model: User}
        ]
    }).then(posts => {
        console.log(posts);
        console.log(posts[0].dataValues)
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

router.post('/add', upload.single('image'), (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            return console.log(result)
        }
        Post.create({
            title: req.body.title,
            CategoryId: req.body.categoryid,
            content: req.body.content,
            UserId: 3,
            slug: req.body.title.replace(/ |?/g, '-').toLowerCase(),
            image: !req.file ? 'placeholder.jpg' : req.file.filename,
            date: req.body.date
        }).then(post => {
            res.redirect('/admin/posts')
        }).catch(err => {
            console.log(err)
        })
    })
})

router.get('/:id/edit', (req, res) => {
    req.checkParams('id', 'post id should be integer').isNumeric();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            return console.log(result)
        }
        Post.findById(req.params.id)
            .then(post => {
                post.dataValues.date = new Date(post.dataValues.date).yyyymmdd();
                Category.findAll()
                    .then(categories => {
                        res.render('admin/posts/edit', {title: 'Edit Post', post: post.dataValues, categories})
                    }).catch(err => {
                        console.log(err);
                    })
            }).catch(err => {
                console.log(err)
            })
    })
})

router.put('/:id/edit', upload.single('image'), (req, res) => {
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('content', 'content is required').notEmpty();
    req.checkParams('id', 'post id should be a numeric').isNumeric();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            return console.log(result)
        }
        var data = {
            title: req.body.title,
            content: req.body.content,
            CategoryId: req.body.categoryid,
            UserId: 3,
            date: req.body.date,
            slug: req.body.title.replace(/ /g, '-').toLowerCase()
        }
        if (req.fie) {
            data.image = req.file.filename
        }
        Post.update(data, { where: {id: req.params.id}})
        .then(post => {
            res.redirect('/admin/posts')
        }).catch(err => console.log(err))
    })
})

router.get('/:id/delete', (req, res) => {
    req.checkParams('id', 'post id should be integer').isNumeric();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            return console.log(result)
        }
        Post.destroy({where: {id: req.params.id}})
            .then(post => {
                res.redirect('/admin/posts');
            }).catch(err => console.log(err));
    })
})

module.exports = router;