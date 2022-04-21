const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const coinsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    coinImage:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})


module.exports =  mongoose.model('Coins',coinsSchema)