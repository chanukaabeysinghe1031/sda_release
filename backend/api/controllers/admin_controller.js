const bcrypt = require("bcryptjs");
const Admin = require("../models/admin_model")

exports.adminLogin = (req, res) => {
    const {email, password} = req.body
    if (email === "" || password === "" || email === null || password === null) {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        Admin.findOne({email: email})
            .then(admin => {
                if (admin) {
                    bcrypt.compare(password, admin.password)
                        .then(isMatch => {
                            if (!isMatch) {
                                res.json({Status: "Unsuccessful", Message: "Password is incorrect."})
                            } else {
                                res.json({
                                    Status: "Successful",
                                    Message: 'Admin has been logged successfully.',
                                    Admin: admin
                                })
                            }
                        })
                } else {
                    res.json({
                        Status: "Unsuccessful",
                        Message: "There is not an admin with this email address."
                    })
                }
            })
            .catch(error => {
                res.json({
                    Status: "Unsuccessful",
                    Message: "An error occurred while finding the admin with this email.",
                    error: error
                })
            })
    }
}

exports.changeEmail = (req, res) => {
    const {adminId, emailAddress} = req.body
    if (adminId === "" || emailAddress === "" || adminId === null || emailAddress === null) {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        Admin.findById(adminId)
            .then(admin => {
                admin.email = emailAddress
                admin.save()
                    .then(result => {
                        res.json({
                            Status: "Successful",
                            Message: 'Email has been changed successfully.',
                            Admin: result
                        })
                    })
                    .catch(error => {
                        res.json({
                            Status: "Unsuccessful",
                            Message: "An error occurred while saving the admin.",
                            error: error
                        })
                    })
            })
            .catch(error => {
                res.json({
                    Status: "Unsuccessful",
                    Message: "An error occurred while finding the admin with this id.",
                    error: error
                })
            })
    }
}

exports.updatePassword = (req, res) => {
    const {adminId, oldPassword, newPassword} = req.body
    if (adminId === "" || oldPassword === "" || newPassword === "" || adminId === null ||
        oldPassword === null || newPassword === null) {
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    } else {
        Admin.findById(adminId)
            .then(admin => {
                bcrypt.compare(oldPassword, admin.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            res.json({Status: "Unsuccessful", Message: "Old password is incorrect."})
                        } else {
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newPassword, salt, (err, hashPassword) => {
                                    if (err) {
                                        throw err
                                    }
                                    admin.password = hashPassword;
                                    admin.save()
                                        .then(response => {
                                            res.json({
                                                Status: "Successful",
                                                Message: 'Password has been updated successfully.',
                                                User: response
                                            })
                                        })
                                        .catch(error => {
                                            res.json({
                                                Status: "Unsuccessful", Message: "Happened while saving the admin" +
                                                    " in database.", error: error
                                            })
                                        })
                                })
                            })
                        }
                    })
            })
            .catch(error => {
                res.json({
                    Status: "Unsuccessful",
                    Message: "An error occurred while finding the admin with this id.",
                    error: error
                })
            })
    }
}