const {adminLogin, changeEmail, updatePassword} = require("../controllers/admin_controller");
const router = require('express').Router()

router.post('/adminLogin',adminLogin)
router.post('/adminChangeEmail',changeEmail)
router.post('/adminUpdatePassword',updatePassword)

module.exports= router