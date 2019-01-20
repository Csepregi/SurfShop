const User = require('../models/user');
const passport = require('passport');


module.exports = {
    //postRegister method POST /register
    async postRegister(req, res, nex){
        const newUser = new User ({
            username: req.body.username, 
            email: req.body.email,
            image: req.body.image
        });
       await User.register(newUser, req.body.password);
       res.redirect("/")
    }, 
    //postLogin POST /login
    postLogin(req, res, next){
        passport.authenticate('local',{   //run the local strategy
            successRedirect: '/',
            failureRedirect: '/login'
           })(req, res, next); // because we have to call it, the authenticate
    }, 
    //logout GET /logout
    getLogout(req, res, next){
        req.logout(); // take out the session
        res.redirect('/');  
    }
}