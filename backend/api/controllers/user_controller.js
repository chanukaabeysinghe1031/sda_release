const User = require("../models/user_model");
const Admin = require("../models/admin_model");
const bcrypt = require("bcryptjs");
const VerificationToken = require('../models/verificationToken')
const nodemailer = require("nodemailer")
const {generateEmailHtml} = require("../utils/mail");
const {token} = require("morgan");
const {accountApprovedEmail} = require("../utils/accountApprovedEmail");


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


// ************************* To register a seller account **************************
exports.signup = async (req, res) => {
    const {
        name, familyName, country, telephoneNumber, bankName, accountNumber, wiseAccountNumber, email,
        password, emailVerified, accountApproved, avatar
    } = req.body

    let avatar2 =""
    if(avatar===""){avatar2 = "uploads/avatar.png"}
    else{avatar2=avatar}
    if (name === "" || familyName === "" || country === "" || telephoneNumber === "" || bankName === "" || accountNumber === "" ||
        wiseAccountNumber === "" || email === "" || password === "") {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        if (password.length >= 8) {
            User.find({email})
                .then(user => {
                    if (user.length > 0) {
                        res.json({
                            Status: "Unsuccessful",
                            Message: "There is a seller with this email address already."
                        })
                    } else {
                        const newUser = new User({
                            name,
                            familyName,
                            country,
                            telephoneNumber,
                            bankName,
                            accountNumber,
                            wiseAccountNumber,
                            email,
                            password,
                            emailVerified,
                            accountApproved,
                            avatar:avatar2
                        })

                        let otp = ''

                        const generateOTP = () => {
                            for (let i = 0; i <= 3; i++) {
                                const randVal = Math.round(Math.random() * 9)
                                otp = otp + randVal
                            }
                            return otp
                        }

                        otp = generateOTP()
                        const verificationToken = new VerificationToken({
                            owner: newUser._id,
                            token: otp
                        })

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(verificationToken.token, salt, (err, hashToken) => {
                                if (err) throw err;
                                verificationToken.token = hashToken;
                                verificationToken.save()
                                    .then(responseVerificationToken => {
                                        console.log(responseVerificationToken)
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
                                            to: newUser.email,
                                            subject: 'Verify your email account',
                                            html: generateEmailHtml(otp)
                                        })

                                        bcrypt.genSalt(10, (err, salt) => {
                                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                                if (err) throw err;
                                                newUser.password = hash;
                                                newUser.save()
                                                    .then(responseSavingUser => {
                                                        console.log(responseSavingUser)
                                                        res.json({
                                                            Status: "Successful",
                                                            Message: 'User has been registered successfully.',
                                                            VerificationToken: responseVerificationToken,
                                                            User: responseSavingUser
                                                        })
                                                    })
                                                    .catch(error => {
                                                        res.json({
                                                            Status: "Unsuccessful",
                                                            Message: "Happened saving the seller in " +
                                                                "DB.",
                                                            error: error
                                                        })
                                                    })
                                            })
                                        });
                                    })
                                    .catch(error => {
                                        res.json({
                                            Status: "Unsuccessful", Message: "Happened while saving the generated OTP" +
                                                " in database.", error: error
                                        })
                                    })
                            })
                        });
                    }
                })
                .catch(error => {
                    res.json({Status: "Unsuccessful", Message: "Happened searching with the email", error: error})
                })
        } else {
            res.json({Status: "Unsuccessful", Message: "Password must have at least 8 characters."})
        }
    }
}

// ****************************** To login to a seller account ******************************
exports.signin = async (req, res) => {
    const {email, password} = req.body;

    //Validation
    if (!email || !password) {
        res.json({Status: "Unsuccessful", Message: 'Email and password must be entered.'});
    }

    //Check for existing user
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                res.json({Status: "Unsuccessful", Message: 'Invalid user email.'})
            } else {
                //Validating password
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            res.json({Status: "Unsuccessful", Message: "Password is incorrect."})
                        } else {
                            res.json({
                                Status: "Successful",
                                Message: 'User has been registered successfully.',
                                User: user
                            })
                        }
                    });
            }
        })
}

// *********************************** To verify email address ***************************
exports.verifyEmail = async (req, res) => {
    const {userId, otp} = req.body
    if (userId === null || otp === null || userId === '' || otp === '') {
        res.json({Message: 'Error : Invalid user id or invalid otp.'})
    }
    User.findById(userId)
        .then(user => {
            if (!user) {
                res.json({Status: "Unsuccessful", Message: 'Invalid user id.'})
            } else {
                if (user.emailVerified) {
                    res.json({Status: "Unsuccessful", Message: 'User is already verified'})
                } else {
                    VerificationToken.findOne({owner: user._id})
                        .then(verificationToken => {
                            if (!verificationToken) {
                                res.json({Status: "Unsuccessful", Message: 'User not found'})
                            } else {
                                bcrypt.compare(otp, verificationToken.token)
                                    .then(isMatch => {
                                        if (!isMatch) {
                                            return res.json({Status: "Unsuccessful", Message: 'OTC is incorrect.'});
                                        } else {
                                            user.emailVerified = true
                                            VerificationToken.findOneAndDelete(token._id)
                                                .then(() => {
                                                    user.save()
                                                        .then(() => {
                                                            res.json({
                                                                Status: "Successful",
                                                                Message: 'Successfully Verified  the email address.'
                                                            })
                                                        })
                                                        .catch(error => {
                                                            res.json({Error: error})
                                                        })
                                                })
                                                .catch((error) => {
                                                    res.json({Error: error})
                                                })
                                        }
                                    });
                            }
                        })
                        .catch(error => {
                            res.json({Status: "Unsuccessful", Message: error})
                        })
                }
            }
        })
}

// *************************** This function is to resend the verification code ************
exports.resendVerificationCode = (req, res) => {
    const userId = req.body.userId
    User.findById(userId)
        .then(user => {
            if (user) {
                if (user.emailVerified === true) {
                    res.json({Status: "Unsuccessful", Message: 'The email address has been already verified.'})
                } else {
                    VerificationToken.find({owner:userId})
                        .then(verificationTokensSearch => {
                            if(verificationTokensSearch){
                                VerificationToken.findOneAndDelete(verificationTokensSearch._id)
                                    .then(responseFromDeletingToken => {
                                        let otp = ''
                                        const generateOTP = () => {
                                            for (let i = 0; i <= 3; i++) {
                                                const randVal = Math.round(Math.random() * 9)
                                                otp = otp + randVal
                                            }
                                            return otp
                                        }

                                        otp = generateOTP()
                                        const verificationToken = new VerificationToken({
                                            owner: userId,
                                            token: otp
                                        })

                                        bcrypt.genSalt(10, (err, salt) => {
                                            bcrypt.hash(verificationToken.token, salt, (err, hashToken) => {
                                                if (err) throw err;
                                                verificationToken.token = hashToken;
                                                verificationToken.save()
                                                    .then(responseVerificationToken => {
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
                                                            to: user.email,
                                                            subject: 'Verify your email account',
                                                            html: generateEmailHtml(otp)
                                                        })
                                                        res.json({
                                                            Status: "Successful",
                                                            Message:"Verification token has been resent successfully. "
                                                        })
                                                    })
                                                    .catch(error => {
                                                        res.json({
                                                            Status: "Unsuccessful",
                                                            Message: "An error occurred while saving the verification token."
                                                        })
                                                    })
                                            })
                                        })
                                    })
                                    .catch(err => {
                                        res.json({
                                            Status: "Unsuccessful",
                                            Message: "An error occurred while deleting the previous verification token.",
                                            error:err
                                        })
                                    })
                            }else{
                                let otp = ''
                                const generateOTP = () => {
                                    for (let i = 0; i <= 3; i++) {
                                        const randVal = Math.round(Math.random() * 9)
                                        otp = otp + randVal
                                    }
                                    return otp
                                }

                                otp = generateOTP()
                                const verificationToken = new VerificationToken({
                                    owner: userId,
                                    token: otp
                                })

                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(verificationToken.token, salt, (err, hashToken) => {
                                        verificationToken.save()
                                            .then(responseVerificationToken => {
                                                const transport = nodemailer.createTransport({
                                                    host: MAIL_TRAP_HOST,
                                                    port:MAIL_TRAP_PORT,
                                                    auth: {
                                                        user:MAIL_TRAP_USER,
                                                        pass: MAIL_TRAP_PASS
                                                    }
                                                });
                                                transport.sendMail({
                                                    from: MAIL_TRAP_EMAIL_ADDRESS,
                                                    to: user.email,
                                                    subject: 'Verify your email account',
                                                    html: generateEmailHtml(otp)
                                                })
                                                res.json({
                                                    Status: "Successful",
                                                    Message:"Verification token has been resent successfully. "
                                                })
                                            })
                                            .catch(error => {
                                                res.json({
                                                    Status: "Unsuccessful",
                                                    Message: "An error occurred while saving the verification token."
                                                })
                                            })
                                    })
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            res.json({
                                Status: "Unsuccessful",
                                Message: "An error occurred while search for the verification token.",
                                error:JSON.stringify(error)
                            })
                        })
                }
            } else {
                res.json({Status: "Unsuccessful", Message: 'Such user has not been found.'})
            }
        })
        .catch(error => {
            res.json({Status: "Unsuccessful", Message: "An error occurred while search for the user in database."})
        })
}

// ************************** To get new seller accounts requests *********************
exports.getSellerAccounts = async (req, res) => {
    User.find()
        .then(result => {
            res.json({Status: "Successful", SellerAccounts: result})
        })
        .catch(error => {
            res.json({Status: "Unsuccessful", Message: error})
        })
}

// ****************************** Approve a seller account ******************************
exports.approveSellerAccount = async (req, res) => {
    const {userId} = req.body
    User.findById(userId)
        .then(user => {
            if (user) {
                if (user.emailVerified) {
                    if (user.accountApproved) {
                        res.json({Status: "Unsuccessful", Message: 'Account has been already approved.'})
                    } else {
                        user.accountApproved = true
                        user.save()
                            .then(result => {
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
                                    to: user.email,
                                    subject: 'You account is successfully verified.',
                                    html: accountApprovedEmail()
                                })
                                    .then(result => {
                                        User.find()
                                            .then(users => {
                                                res.json({Status: "Successful", SellerAccounts: users})
                                            })
                                            .catch(error => {
                                                res.json({Status: "Unsuccessful", Message: error})
                                            })
                                    })
                                    .catch(error => {
                                        res.json({Status: "Unsuccessful", Message: error})
                                    })
                            })
                            .catch(error => {
                                res.json({Status: "Unsuccessful", Message: error})
                            })
                    }
                } else {
                    res.json({Status: "Unsuccessful", Message: 'Email has not been verified still.'})
                }
            } else {
                res.json({Status: "Unsuccessful", Message: 'Such user has not been found.'})
            }
        })
        .catch(err => {
            res.json({Status: "Unsuccessful", Message: err})
        })
}

exports.updateSellerProfileImage = (req, res) => {
    const {sellerId} = req.body
    if (sellerId === "" || req.file === null) {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        User.findById(sellerId)
            .then(user => {
                if (user) {
                    user.avatar = req.file.path
                    user.save()
                        .then(result => {
                            res.json({
                                Status: "Successful",
                                Message: 'Profile image has been updated successfully.',
                                User: result
                            })
                        })
                        .catch(error => {
                            res.json({
                                Status: "Unsuccessful", Message: "Happened while saving the user" +
                                    " in database.", error: error
                            })
                        })
                } else {
                    res.json({Status: "Unsuccessful", Message: "The seller id is incorrect."})
                }
            })
            .catch(error => {
                res.json({
                    Status: "Unsuccessful", Message: "Happened while searching for the user" +
                        " in database.", error: error
                })
            })
    }
}

exports.updatePassword = async (req, res) => {
    const {sellerId, oldPassword, newPassword} = req.body
    if (oldPassword === "" || newPassword === "" || sellerId === "") {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        User.findById(sellerId)
            .then(seller => {
                if (seller) {
                    bcrypt.compare(oldPassword, seller.password)
                        .then(isMatch => {
                            if (!isMatch) {
                                res.json({Status: "Unsuccessful", Message: "The old password is incorrect."})
                            } else {
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(newPassword, salt, (err, hashPassword) => {
                                        if (err) {
                                            throw err
                                        }
                                        seller.password = hashPassword;
                                        seller.save()
                                            .then(response => {
                                                res.json({
                                                    Status: "Successful",
                                                    Message: 'Password has been updated successfully.',
                                                    User: response
                                                })
                                            })
                                            .catch(error => {
                                                res.json({
                                                    Status: "Unsuccessful", Message: "Happened while saving the user" +
                                                        " in database.", error: error
                                                })
                                            })
                                    })
                                })
                            }
                        })
                } else {
                    res.json({Status: "Unsuccessful", Message: "The seller id is incorrect."})
                }
            })
            .catch(error => {
                res.json({
                    Status: "Unsuccessful", Message: "Happened while searching for the user" +
                        " in database.", error: error
                })
            })
    }
}

exports.updateProfileDetails = (req, res) => {
    const {sellerId, country, telephoneNumber, bankName, accountNumber} = req.body
    if (sellerId === "") {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        User.findById(sellerId)
            .then(seller => {
                if (seller) {
                    if (country !== null && country !== "") {
                        seller.country = country
                    }
                    if (telephoneNumber !== null && telephoneNumber !== "") {
                        seller.telephoneNumber = telephoneNumber
                    }
                    if (bankName !== null && bankName !== "") {
                        seller.bankName = bankName
                    }
                    if (accountNumber !== null && accountNumber !== "") {
                        seller.accountNumber = accountNumber
                    }

                    seller.save()
                        .then(response => {
                            res.json({
                                Status: "Successful",
                                Message: 'Profile has been updated successfully.',
                                User: response
                            })
                        })
                        .catch(error => {
                            res.json({
                                Status: "Unsuccessful", Message: "Happened while saving the user" +
                                    " in database.", error: error
                            })
                        })
                } else {
                    res.json({Status: "Unsuccessful", Message: "The seller id is incorrect."})
                }
            })
            .catch(error => {
                res.json({
                    Status: "Unsuccessful", Message: "Happened while searching for the user" +
                        " in database.", error: error
                })
            })
    }
}

exports.deleteAccount = (req, res) => {
    const sellerId = req.body.sellerId
    User.findById(sellerId)
        .then(seller => {
            if (seller) {
                seller.delete()
                    .then(response => {
                        res.json({
                            Status: "Successful",
                            Message: 'Profile has been deleted successfully.',
                            User: response
                        })
                    })
                    .catch(error => {
                        res.json({
                            Status: "Unsuccessful", Message: "Happened while deleting the user" +
                                " in database.", error: error
                        })
                    })
            } else {
                res.json({Status: "Unsuccessful", Message: "The seller id is incorrect."})
            }
        })
        .catch(error => {
            res.json({
                Status: "Unsuccessful", Message: "Happened while searching for the user" +
                    " in database.", error: error
            })
        })
}