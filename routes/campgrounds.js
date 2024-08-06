const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync");
const { campgroundSchema } = require("../Schemas.js");
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");

router.get("/", async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index", { camps });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("sucess", "sucessfully created a new campground");
    res.redirect("/campgrounds");
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(campground.reviews);
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);

    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("sucess", "sucessfully edited the campground");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("sucess", "sucessfully deleted the campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
