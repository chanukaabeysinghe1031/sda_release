const {check,validationResult} = require("express-validator");
exports.validatorUser = [
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is missing')
        .withMessage("Name must be 3 to 30 characters"),
    check('familyName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Family name is missing')
        .withMessage("Family name must be 3 to 30 characters"),
    check('country')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Country is missing'),
    check('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Email is invalid'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is Empty')
        .isLength({min:8,max:20})
        .withMessage('Password must be minimum 8 checracters and maximum 20 characters.')
]

exports.validate = (req,res,next) => {
    const error = validationResult(req).array()
    if(!error.length){
        return next()
    }
    res.status(400).json({success:false,error:error[0].msg})
}