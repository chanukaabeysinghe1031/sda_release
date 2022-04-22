const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const verificationTokensSchema = new mongoose.Schema({
    owner : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    token :{
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        expires : 360000,
        default : Date.now()
    }
})


module.exports =  mongoose.model('Verification_Tokens',verificationTokensSchema)