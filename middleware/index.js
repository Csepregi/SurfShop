module.exports = { 
	errorHandler: (fn) =>  //function(fn)
        (req, res, next) => {   // function
            Promise.resolve(fn(req, res, next))
            .catch(next); // that next carry the error handler
    }
}
	
