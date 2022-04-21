const router = require('express').Router()
const {signup, signin, verifyEmail, getSellerAccounts, approveSellerAccount, updateSellerProfileImage, updatePassword,
    updateProfileDetails, deleteAccount, resendVerificationCode
} = require('../controllers/user_controller')
const {check} = require("express-validator");
const {validatorUser, validate} = require("../middleware/validator");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 500},
    fileFilter: fileFilter
});


router.post('/signup',validatorUser,validate,signup)
router.post('/signin',signin)
router.post('/verifyEmail',verifyEmail)
router.post('/resendToken',resendVerificationCode)
router.get('/getSellerAccounts',getSellerAccounts)
router.post('/approveSellerAccount',approveSellerAccount)
router.post('/updateProfileImage',upload.single('profileImage'),updateSellerProfileImage)
router.post('/updatePassword',updatePassword)
router.post('/updateProfile',updateProfileDetails)
router.post('/deleteProfile',deleteAccount)
module.exports= router