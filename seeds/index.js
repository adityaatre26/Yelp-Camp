const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("Connection Initiated");
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection errror"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30);
    const camp = new Campground({
      author: "66ace7d1a7ad4dbb19f44785",
      location: `${cities[rand].city},${cities[rand].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad impedit unde exercitationem!",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [cities[rand].longitude, cities[rand].latitude],
      },
      image: [
        {
          url: "https://res.cloudinary.com/dgyy7cgko/image/upload/v1723265022/YelpCamp/b1zulq2hdh7o4rwyxr7j.png",
          filename: "YelpCamp/b1zulq2hdh7o4rwyxr7j",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
