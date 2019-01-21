const Post = require('../models/post');

module.exports = {
    // POST index
    async getPosts(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', {posts}); //ejs6 enough just give one posts, not posts: posts
    }, 
    // POST new ,new posts
    newPost(req, res, next){
        res.render('posts/new'); // its know that we looking it in views folder and a ejs file
    }, 
    // Posts Create
    async createPost(req, res, next){
        // use req.body to create  a new Post
        let post = await Post.create(req.body);
        res.redirect(`/posts/${post.id}`);
    }
}