const express= require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedin,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// DELETE Route for REVIEW
router.delete("/:reviewId",isLoggedin,isReviewAuthor, reviewController.destroyReview)

// POST Route for REVIEW
router.post("/",isLoggedin,validateReview, wrapAsync(reviewController.createReview));

module.exports = router;