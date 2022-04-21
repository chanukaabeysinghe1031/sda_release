const {validatorUser, validate} = require("../middleware/validator");
const {signup} = require("../controllers/user_controller");
const router = require('express').Router()
const multer = require("multer");
const {addCoins, getCoins} = require("../controllers/coins_controller");
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

router.post('/addCoin',upload.single('coinImage'),addCoins)
router.get('/getCoins',getCoins)
module.exports= router