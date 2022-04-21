const {confirmTransaction, getAllNonApprovedTransactions, approveTransaction, getAllTransactions, getSellerTransactions} = require("../controllers/transactions_controller");
const router = require('express').Router()

router.post('/confirmTransaction',confirmTransaction)
router.get('/getAllTransactions',getAllTransactions)
router.post('/getSellerTransactions',getSellerTransactions)
router.post('/approveTransaction',approveTransaction)
module.exports = router