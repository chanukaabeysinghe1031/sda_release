const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    familyName:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    telephoneNumber:{
        type:String,
        required:true
    },
    bankName:{
        type:String,
        required:true
    },
    accountNumber:{
        type:String,
        required:true
    },
    wiseAccountNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    emailVerified:{
        type:Boolean,
        default:false,
        required:true
    },
    accountApproved:{
       type:Boolean,
        default:false,
       required:true
    },
    avatar:{
        type:String,
        default:''
    }
})


module.exports =  mongoose.model('User',userSchema)