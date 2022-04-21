const express = require('express');
const connectDB = require('./db/connection')
const userRouter = require('./api/routes/user_routes')
const coinsRouter = require('./api/routes/coins_routes')
const transactionsRouter = require('./api/routes/transactions_routes')
const adminRouter = require('./api/routes/admin_routes')
const cors = require('cors')
const app = express();

const PORT =  process.env.Port || 3003;

connectDB();
app.use(cors());
app.use(express.json())
app.use('/uploads',express.static('uploads'));
app.use('/api/user',userRouter )
app.use('/api/coins',coinsRouter )
app.use('/api/transactions',transactionsRouter )
app.use('/api/admin',adminRouter )

app.use(express.urlencoded({ extended: true }));

app.listen(PORT,()=>{
    console.log("SDA SERVER HAS STARTED!");
})
