const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
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
        res.render('posts/index', {posts, title: 'Post index'}); //ejs6 enough just give one posts, not posts: posts
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

       
             let response = await geocodingClient
             .forwardGeocode({
                 query: req.body.post.location,
                 limit: 1
             })
             .send();

             req.body.post.coordinates = response.body.features[0].geometry.coordinates;     
             
        // use req.body to create  a new Post
        let post = await Post.create(req.body.post);
        console.log(post);
        console.log(post.coordinates);
        req.session.success = "Post created successfully";
        res.redirect(`/posts/${post.id}`);
    }, 
    // Posts show
    async postShow(req, res, next){
        let post = await Post.findById(req.params.id).populate({
            path: 'reviews',
            options: {sort: {'_id': -1}},// sort in descending order (-1)
            populate: {
                path: "author",
                model: "User"
            }
         });
        res.render('posts/show', { post });
    }, 

    async postEdit(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', {post});
    },

    async postUpdate(req, res, next){
        // find the post by id
        let post = await Post.findById(req.params.id);
        // check if there is any images for deletion
        if(req.body.deleteImages && req.body.deleteImages.length){ // length because 0 is falsy it would not go to if statement
            //eval(require('locus'));
            // assign deleteImages from req.body to its own variable
            let deleteImages = req.body.deleteImages;
            //loop over deleteImages
            for(const public_id of deleteImages){
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // delete images from post.images
                for(const image of post.images){
                    if(image.public_id === public_id){
                        let index = post.images.indexOf(image); //take out from the array
                        post.images.splice(index, 1);
                    }
                }
            }
        }
        // check if there are any new images for upload
        if(req.files) { // we get req.files because of multer
            // upload images
            for(const file of req.files){
                let image = await cloudinary.v2.uploader.upload(file.path);
                // add images to post.images array
                post.images.push({ // already have access to array
                    url: image.secure_url,
                    public_id: image.public_id
                });
            }
        }
        // check if location is updated
        if(req.body.post.location != post.location){
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
            post.coordinates = response.body.features[0].geometry.coordinates;   
            post.location = req.body.post.location;
  
        }

        //update the post with new any new properties
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        // save the updated post into the db
        post.save();
        // redirect to show page
        res.redirect(`/posts/${post.id}`); // same as req.params.id
    }, 

    async postDestroy(req, res, next){
        let post = await Post.findById(req.params.id);
        for(const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post deleted successfully!';
        res.redirect('/posts');
    }
}


