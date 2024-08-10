const Campground = require("../models/campground");

module.exports.indexPage = async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index", { camps });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.saveNewForm = async (req, res, next) => {
  const newCamp = new Campground(req.body.campground);
  newCamp.image = await req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCamp.author = req.user._id;
  await newCamp.save();
  console.log(newCamp);
  req.flash("sucess", "sucessfully created a new campground");
  res.redirect("/campgrounds");
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findById(id);

  res.render("campgrounds/edit", { campground });
};

module.exports.saveEditForm = async (req, res) => {
  const { id } = req.params;
  // const campground = await Campground.findById(id);
  await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash("sucess", "sucessfully edited the campground");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReq = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("sucess", "sucessfully deleted the campground");
  res.redirect("/campgrounds");
};
