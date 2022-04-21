const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const transactionsSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coins',
        required: true
    },
    quantity: {
        type: Intl,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    withdrawAddress: {
        type: String,
        required: true
    },
    transactionDate: {
        type: Date,
        default : Date.now()
    },
    status: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Transactions', transactionsSchema)