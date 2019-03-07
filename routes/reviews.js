const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams hold the id, so we can see it's details
const {asyncErrorHandler, isReviewAuthor} = require("../middleware"); // looks index automatically
const {
  reviewCreate,
  reviewUpdate, 
  reviewDestroy 
} = require('../controllers/reviews')

/* POST reviews create /posts/:id/reviews */
router.post('/', asyncErrorHandler(reviewCreate));



/* PUT reviews update /posts/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor,  asyncErrorHandler(reviewUpdate));


/* DELETE reviews destroy /posts/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));


  
  module.exports = router;

