const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const CampgroundSchema = new Schema({
  title: String,
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground) {
    const del = await Review.deleteMany({ _id: { $in: campground.reviews } });
    console.log(del);
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
