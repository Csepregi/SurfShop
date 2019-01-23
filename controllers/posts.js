const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'surfshop',
    api_key: '836421748282483',
    api_secret: 'zwrxn1eLwJeYBNB_IFa88cSEOBI'//process.env.CLOUDINARY_SECRET
})

module.exports = {
    // POST index
    async postIndex(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', {posts}); //ejs6 enough just give one posts, not posts: posts
    }, 
    // POST new ,new posts
    postNew(req, res, next){
        res.render('posts/new'); // its know that we looking it in views folder and a ejs file
    }, 
    // Posts Create
    async postCreate(req, res, next){
        req.body.post.images = [];
        for(const file of req.files){
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }

        // use req.body to create  a new Post
        let post = await Post.create(req.body.post);
        res.redirect(`/posts/${post.id}`);
    }, 
    // Posts show
    async postShow(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    }, 

    async postEdit(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', {post});
    },

    async postUpdate(req, res, next){
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post, { new: true}); // returned the newly updated post from db
        //eval(require('locus'));
        res.redirect(`/posts/${post.id}`); // same as req.params.id
    }, 

    async postDestroy(req, res, next){
        await Post.findByIdAndRemove(req.params.id);
        res.redirect('/posts');
    }
}

