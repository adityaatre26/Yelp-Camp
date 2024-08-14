const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const imageSchema = new Schema({
  url: String,
  filename: String,
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    image: [imageSchema],
    price: Number,
    description: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground) {
    const del = await Review.deleteMany({ _id: { $in: campground.reviews } });
    console.log(del);
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
