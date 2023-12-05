require("dotenv").config();
const mongoose = require("mongoose");
const mongoURL = process.env.MONGODB_URL;

const connectToMongo = () => {
    mongoose
        .connect(mongoURL, { useNewUrlParser: true })
        .then(() => {
            console.log("Connected to MongoDB Successfully");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB", error);
        });
};

module.exports = connectToMongo;
