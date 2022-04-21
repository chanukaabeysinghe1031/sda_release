const Coins = require('../models/coins_model')


// ***************************** To Add Coins ***********************************
exports.addCoins = (req,res) => {
    const {name,price} = req.body

    if(name==""||price===null||name===null||req.file===null){
        res.json({Status:"Unsuccessful",Message:"All the data must be entered."})
    }else{
        Coins.findOne({name:name})
            .then(coin => {
                if(coin){
                    res.json({Status:"Unsuccessful",Message:"The coin is already added to the database."})
                }else{
                    let profilePath = ''
                    const newCoin = new Coins({
                        name,
                        price,
                        coinImage:req.file.path
                    })
                    newCoin.save()
                        .then(addedCoin => {
                            res.json({
                                Status : "Successful",
                                Message: 'Coin has been added successfully.',
                                Coin : addedCoin
                            })
                        })
                        .catch(error => {
                            res.json({
                                Status: "Unsuccessful", Message: "Happened while saving the coin in database." +
                                    " in database.", error: error
                            })
                        })
                }
            })
            .catch(error => {
                console.log(error)
                res.json({Status:"Unsuccessful",Message:"Happened while searching a coin with same name" +
                        " in database.",error:error})
            })
    }
}

exports.getCoins = (req,res) => {
    Coins.find()
        .then(coins => {
            res.json({
                Status : "Successful",
                Coins : coins
            })
        })
        .catch(error => {
            res.json({Status:"Unsuccessful",Message:"Happened while getting coins from the database",error:error})
        })
}