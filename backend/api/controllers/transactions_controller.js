const Transactions = require('../models/transactions_model')
const Coins = require('../models/coins_model')
const Users = require('../models/user_model')
const Admin = require("../models/admin_model");
const nodemailer = require("nodemailer")
const {transactionConfirmationEmail} = require("../utils/transactionConfirmationEmail");
const {transactionApprovalEmail} = require("../utils/transactionApprovalEmail");

// ****************************************************************************************
// ******************************* MAIL TRAP DETAILS **************************************
// ****************************************************************************************
const MAIL_TRAP_HOST = "smtp.mailtrap.io";
const MAIL_TRAP_PORT = 2525;
const MAIL_TRAP_USER = "cee1fc3e7d6ac6";
const MAIL_TRAP_PASS = "e2ead6319e1f50";
const MAIL_TRAP_EMAIL_ADDRESS = "sellyourdigitalassets@gmail.com";
// ****************************************************************************************
// ****************************************************************************************



// ***************************** To Confirm Transaction ***********************************
exports.confirmTransaction = (req, res) => {
    const {sellerId, coinId, quantity, deliveryAddress, withdrawAddress} = req.body
    if (sellerId === null || coinId === null || quantity === null || deliveryAddress === ""
        || withdrawAddress === "") {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        Admin.findOne({admin:"admin"})
            .then(admin => {
                let adminEmail = admin.email
                Users.findById(sellerId)
                    .then(seller => {
                        if (seller) {
                            Coins.findById(coinId)
                                .then(coin => {
                                    if (coin) {
                                        const transport = nodemailer.createTransport({
                                            host: MAIL_TRAP_HOST,
                                            port: MAIL_TRAP_PORT,
                                            auth: {
                                                user: MAIL_TRAP_USER,
                                                pass: MAIL_TRAP_PASS
                                            }
                                        });
                                        transport.sendMail({
                                            from: MAIL_TRAP_EMAIL_ADDRESS,
                                            to: adminEmail,
                                            subject: 'New Selling Transaction Request',
                                            html: transactionConfirmationEmail(
                                                seller.name,
                                                coin.name,
                                                coin.price,
                                                quantity,
                                                coin.price * quantity,
                                            )
                                        })

                                        const transaction = new Transactions({
                                            sellerId,
                                            coinId,
                                            quantity,
                                            deliveryAddress,
                                            withdrawAddress,
                                            totalCost: coin.price * quantity,
                                            status: "New Transaction"
                                        })
                                        transaction.save()
                                            .then(responseOfSaving => {
                                                res.json({
                                                    Status: "Successful",
                                                    Message: 'Transaction has been saved successfully.',
                                                    Transaction: responseOfSaving
                                                })
                                            })
                                            .catch(error => {
                                                console.log(error)
                                                res.json({
                                                    Status: "Unsuccessful",
                                                    message: "Happened saving the transaction in " +
                                                        "DB.",
                                                    error: error
                                                })
                                            })
                                    } else {
                                        console.log(error)
                                        res.json({Status: "Unsuccessful", Message: "The coin id is invalid."})
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                    res.json({
                                        Status: "Unsuccessful",
                                        Message: "Happened while searching for coin in database.",
                                        error: error
                                    })
                                })
                        } else {
                            console.log(error)
                            res.json({Status: "Unsuccessful", Message: "The seller id is invalid."})
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        res.json({
                            Status: "Unsuccessful",
                            Message: "Happened while searching for seller in database.",
                            error: error
                        })
                    })
            })
            .catch(error => {
                console.log(error)
                res.json({
                    Status: "Unsuccessful", Message: "Happened while searching database.", error: error
                })
            })
    }
}

// ****************************** Get all transactions ***************************
function getTransaction(transaction) {
    return new Promise((resolve, reject) => {
        let sellerId = transaction.sellerId;
        let coinId = transaction.coinId

        Users.findById(sellerId)
            .then(seller => {
                Coins.findById(coinId)
                    .then(coin => {
                        resolve({
                            'TransactionDetails': transaction,
                            'SellerDetails': seller,
                            'CoinDetails': coin
                        })
                    })
            })
    })
}

exports.getAllTransactions = (req, res) => {
    let transactions = []
    Transactions.find()
        .then(transactions => {
            Promise.all(transactions.map(transaction => getTransaction(transaction)))
                .then(updatedTransactions => {
                    res.json({Status: "Successful", Transactions: updatedTransactions})
                })
        })
        .catch(error => {
            res.json({Status: "Unsuccessful", Message: "Happened while getting transactions from the DB", Error: error})
        })
}

exports.getSellerTransactions = (req, res) => {
    const sellerId = req.body.sellerId
    let transactions = []
    Transactions.find({sellerId: sellerId})
        .then(transactions => {
            Promise.all(transactions.map(transaction => getTransaction(transaction)))
                .then(updatedTransactions => {
                    res.json({Status: "Successful", Transactions: updatedTransactions})
                })
        })
        .catch(error => {
            res.json({Status: "Unsuccessful", Message: "Happened while getting transactions from the DB", Error: error})
        })
}

// ****************************** Approve transactions ***************************
exports.approveTransaction = (req, res) => {
    const {transactionId} = req.body

    if (transactionId === "") {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        Transactions.findById(transactionId)
            .then(transaction => {
                if (transaction && transaction.status === "New Transaction") {
                    let sellerId = transaction.sellerId
                    let coinId = transaction.coinId

                    Users.findById(sellerId)
                        .then(seller => {
                            Coins.findById(coinId)
                                .then(coin => {
                                    transaction.status = "Approved"
                                    transaction.save()
                                        .then(response => {
                                            const transport = nodemailer.createTransport({
                                                host: MAIL_TRAP_HOST,
                                                port: MAIL_TRAP_PORT,
                                                auth: {
                                                    user: MAIL_TRAP_USER,
                                                    pass: MAIL_TRAP_PASS
                                                }
                                            });
                                            transport.sendMail({
                                                from: MAIL_TRAP_EMAIL_ADDRESS,
                                                to: seller.email,
                                                subject: 'Your Selling Transaction Request Has Been Approved.',
                                                html: transactionApprovalEmail(
                                                    seller.name,
                                                    coin.name,
                                                    coin.price,
                                                    transaction.quantity,
                                                    transaction.totalCost
                                                )
                                            })

                                            res.json({
                                                Status: "Successful",
                                                Message: 'Transaction has been approved successfully.',
                                                Transaction: response
                                            })
                                        })
                                        .catch(error => {
                                            res.json({
                                                Status: "Unsuccessful",
                                                Message: "Happened while updating the transaction in DB.",
                                                Error: error
                                            })
                                        })
                                })
                                .catch(error => {
                                    res.json({
                                        Status: "Unsuccessful",
                                        Message: "Happened while getting coin details from the DB.",
                                        Error: error
                                    })
                                })
                        })
                        .catch(error => {
                            res.json({
                                Status: "Unsuccessful",
                                Message: "Happened while getting seller details from the DB.",
                                Error: error
                            })
                        })
                } else {
                    res.json({
                        Status: "Unsuccessful",
                        Message: "The transaction id is invalid or transaction has been already approved.."
                    })
                }
            })
    }
}