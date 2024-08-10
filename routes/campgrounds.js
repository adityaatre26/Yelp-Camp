const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  indexPage,
  renderNewForm,
  saveNewForm,
  showCampground,
  renderEditForm,
  saveEditForm,
  deleteReq,
} = require("../controllers/campgrounds.js");

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");

router.get("/", indexPage);

router.get("/new", isLoggedIn, renderNewForm);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(saveNewForm)
);
// router.post("/", upload.array("image"), (req, res) => {});

router.get("/:id", catchAsync(showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  isAuthor,
  catchAsync(saveEditForm)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(deleteReq));

module.exports = router;
