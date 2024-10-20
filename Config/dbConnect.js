const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((error) => {
        console.log("Error while connecting to DB:", error);
    });
}

module.exports = dbConnect;
