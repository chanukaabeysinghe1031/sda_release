const mongoose = require('mongoose');

const URI = "mongodb+srv://admin:admin@cluster0.wz3uu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const connectDB = async () =>{
    await mongoose.connect(URI,{
        useUnifiedTopology:true,
        useNewUrlParser:true,
    });
    console.log("SDA DATABASE CONNECTION HAS BEEN SET UP!")
}

module.exports = connectDB;