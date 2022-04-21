const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:String,
        required:true,
        default:"admin"
    }
})


module.exports =  mongoose.model('Admin',adminSchema)