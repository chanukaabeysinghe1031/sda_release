import React, {Component} from 'react';
import './adminTransactionDetails.css'
import {Navigate} from "react-router-dom";

const axios = require('axios').default;

class AdminTransactionDetails extends Component {

    constructor(props) {
        super(props);
        const transaction = localStorage.getItem("SelectedTransactionDetails");
        const transactionParsed = JSON.parse(transaction);
        const transactionDetails = transactionParsed.TransactionDetails
        const sellerDetails = transactionParsed.SellerDetails
        const coinDetails = transactionParsed.CoinDetails
        this.state = {
            transactionDetails: transactionDetails,
            coinDetails: coinDetails,
            sellerDetails: sellerDetails,
            reDirectToTransactions: false,
            error: ""
        }
    }

    render() {
        if (this.state.reDirectToTransactions) {
            return <Navigate to="/adminDashBoard"/>
        } else {
            return (
                <div className="adminBuyCoins_main">
                    <div className="adminBuyCoins_sub">
                        <div className="dynamicBuyCoinsComponentMain">
                            <div className="dynamicBuyCoinsComponent">
                                <div className="buyCoinComponent_coinDetails">
                                    <h1 className="adminBuyCoins_title">Seller Details</h1>
                                    <div className="detailsComponent">
                                        <img className="adminBuyImage"
                                             src={"http://localhost:3003/" + this.state.sellerDetails.avatar}
                                             alt="No image"/>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Name</h7>
                                            <h7 className="adminButDetailsData">{this.state.sellerDetails.name} {this.state.sellerDetails.familyName}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Country</h7>
                                            <h7 className="adminButDetailsData">{this.state.sellerDetails.country}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Telephone Number</h7>
                                            <h7 className="adminButDetailsData">{this.state.sellerDetails.telephoneNumber}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Bank Name</h7>
                                            <h7 className="adminButDetailsData">{this.state.sellerDetails.bankName}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Account Number</h7>
                                            <h7 className="adminButDetailsData">{this.state.sellerDetails.accountNumber}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Wise Account Number</h7>
                                            <h7 className="adminButDetailsData">{this.state.sellerDetails.wiseAccountNumber}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Email</h7>
                                            <h7 className="adminButDetailsData">{this.state.sellerDetails.email}</h7>
                                        </div>
                                    </div>
                                </div>
                                <div className="buyCoinComponent_sellerDetails">
                                    <h1 className="adminBuyCoins_title">Transaction Details</h1>
                                    <div className="detailsComponent">
                                        <img className="adminBuyImage"
                                             src={"http://localhost:3003/" + this.state.coinDetails.coinImage}
                                             alt="No image"/>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Coin Name</h7>
                                            <h7 className="adminButDetailsData">{this.state.coinDetails.name}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Coin Price</h7>
                                            <h7 className="adminButDetailsData">{this.state.coinDetails.price}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Withdraw Address</h7>
                                            <h7 className="adminButDetailsData">{this.state.transactionDetails.withdrawAddress}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Delivery Address</h7>
                                            <h7 className="adminButDetailsData">{this.state.transactionDetails.deliveryAddress}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Number of Coins</h7>
                                            <h7 className="adminButDetailsData">{this.state.transactionDetails.quantity}</h7>
                                        </div>
                                        <div className="adminBuyDataRow">
                                            <h7 className="adminBuyDetailsHeader">Total Price</h7>
                                            <h7 className="adminButDetailsData">{this.state.transactionDetails.totalCost}</h7>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="adminBuyButtonsContainer">
                                <div className="adminButDashboardButton"
                                     onClick={() => this.setState({reDirectToTransactions: true})}>
                                    <h7 className="adminGoToDashboardButton">Go To Dashboard</h7>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default AdminTransactionDetails;