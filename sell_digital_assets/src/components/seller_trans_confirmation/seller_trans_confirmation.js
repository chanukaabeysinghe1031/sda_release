import React, {Component} from 'react';
import './seller_trans_confirmation.css'
import {Navigate} from "react-router-dom";

const axios = require('axios').default;

class SellerTransConfirmation extends Component {
    constructor(props) {
        super(props);
        const seller = localStorage.getItem("user");
        const coinSelectedByUser = localStorage.getItem("CoinSelectedBySeller")
        const sellerParsed = JSON.parse(seller);
        const coinParsed = JSON.parse(coinSelectedByUser);
        console.log("Local Storage Seller",)
        console.log("Local Storage coin", coinParsed)
        this.state = {
            coin: coinParsed,
            seller: sellerParsed,
            coinsQuantity: null,
            agreed: false,
            withdrawAddress: "",
            price: 0,
            deliveryAddress: "",
            hideTotalPrice: "displayTotalPrice",
            error:"",
            reDirectToDashboard:false
        }
    }

    confirmTransaction = () => {
        if(this.state.coinsQuantity===null||this.state.coinsQuantity===0||this.state.deliveryAddress===""
        ||this.state.withdrawAddress===""){
            this.setState({error:"Please fill all the variables"})
        }else if(this.state.seller===null||this.state.coin===null){
            this.setState({error:"An error occurred."})
        }else{
            axios.post('http://localhost:3003/api/transactions/confirmTransaction',
                {
                    sellerId: this.state.seller._id,
                    coinId: this.state.coin._id,
                    quantity: this.state.coinsQuantity,
                    deliveryAddress: this.state.deliveryAddress,
                    withdrawAddress: this.state.withdrawAddress
                }
            )
                .then(reponse => {
                    console.log(reponse)
                    this.setState({reDirectToDashboard:true})
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    render() {
        if(this.state.reDirectToDashboard){
            return <Navigate to="/sellerHomePage"/>
        }else{
            return (
                <div className="seller_confirmation_main">
                    <div className="seller_confirmation_sub">
                        <h1 className="confirmation_selling_coin_title">Confirm You Transaction</h1>
                        <div className="confirmation_selling_container">
                            <div className="confirmation_selling_coin_component">
                                <img className="confirmation_selling_coin_image"
                                     src={"http://localhost:3003/" + this.state.coin.coinImage}/>
                                <h3 className="confirmation_selling_coin_header">Coin Name</h3>
                                <h3 className="confirmation_selling_coin_text">{this.state.coin.name}</h3>
                                <h3 className="confirmation_selling_coin_header">Coin Price</h3>
                                <h3 className="confirmation_selling_coin_text">{this.state.coin.price} (USD)</h3>
                                <div className="coins_quantity_selection_component">
                                    <h6 className="confirmation_selling_seller_component_title">Please enter the number of
                                        coins you are going to sell.</h6>
                                    <input
                                        type="number"
                                        className="coinsQuantitySelector"
                                        onChange={(e) => {
                                            let tot = e.target.value * this.state.coin.price
                                            this.setState({
                                                price: tot,
                                                coinsQuantity:e.target.value
                                            })
                                        }}
                                    />
                                    <h6 className={this.state.hideTotalPrice}>The total price : USD {this.state.price}</h6>
                                </div>
                            </div>
                            <div className="confirmation_selling_seller_component">
                                <h1 className="confirmation_selling_seller_component_title">Your Details Are </h1>
                                <div className="sellerDetailsRow">
                                    <h3 className="confirmation_selling_seller_header">Bank Name</h3>
                                    <h3 className="confirmation_selling_seller_filled_data">{this.state.seller.bankName}</h3>
                                </div>
                                <div className="sellerDetailsRow">
                                    <h3 className="confirmation_selling_seller_header">Account Number</h3>
                                    <h3 className="confirmation_selling_seller_filled_data">{this.state.seller.accountNumber} </h3>
                                </div>
                                <div className="sellerDetailsRow">
                                    <h3 className="confirmation_selling_seller_header">Country</h3>
                                    <h3 className="confirmation_selling_seller_filled_data">{this.state.seller.country} </h3>
                                </div>
                                <div className="sellerDetailsRow">
                                    <h3 className="confirmation_selling_seller_header">Wise Account Number</h3>
                                    <h3 className="confirmation_selling_seller_filled_data">{this.state.seller.wiseAccountNumber} </h3>
                                </div>
                                <div className="sellerDetailsRow">
                                    <h3 className="confirmation_selling_seller_header">Delivery Address</h3>
                                    <input
                                        type="text"
                                        className="confirmation_selling_seller_text"
                                        onChange={(e) => {
                                            this.setState({
                                                deliveryAddress: e.target.value
                                            })
                                        }}
                                    />
                                </div>
                                <div className="sellerDetailsRow">
                                    <h3 className="confirmation_selling_seller_header">Withdraw Address</h3>
                                    <input
                                        type="text"
                                        className="confirmation_selling_seller_text"
                                        onChange={(e) => {
                                            this.setState({
                                                withdrawAddress: e.target.value
                                            })
                                        }}
                                    />
                                </div>

                                <h5 className="confirmation_selling_seller_component_agree_details">
                                    I confirm that, above information are correct and I agree to all the terms and the
                                    conditions.
                                </h5>

                                <h7>{this.state.error}</h7>
                                <div className="sellerConfirmationAgreeBox" onClick={this.confirmTransaction}>
                                    <h7>I agree and proceed to the transaction</h7>
                                </div>

                                <div className="sellerConfirmationGoBack" onClick={() => {
                                    this.setState({reDirectToDashboard:true})
                                }}>
                                    <h7>Dashboard</h7>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default SellerTransConfirmation;