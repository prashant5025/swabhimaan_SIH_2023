const mongoose = require("mongoose");



const connectDB  = async (url) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    });
    console.log("Connected to DB")
};

module.exports = connectDB