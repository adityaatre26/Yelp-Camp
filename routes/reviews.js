const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn } = require("../middleware.js");

const { reviewSchema } = require("../Schemas.js");
const { validateReviews } = require("../middleware.js");
const { renderReviewForm, deleteReview } = require("../controllers/reviews.js");

router.post("/", isLoggedIn, validateReviews, catchAsync(renderReviewForm));

router.delete("/:reviewId", catchAsync(deleteReview));

module.exports = router;
