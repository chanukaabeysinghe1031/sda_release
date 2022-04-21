import React, {Component} from 'react';
import {Navigate} from "react-router-dom";
import './sellerOldTransactions.css'
const axios = require('axios').default;


class SellerOldTransactions extends Component {
    constructor(props) {
        super(props);
        const seller = localStorage.getItem("user");
        const sellerParsed = JSON.parse(seller);
        const sellerNew = sellerParsed
        this.state = {
            reDirectToSellerHomePage:false,
            transactions: [],
            searchTerm: '',
            profileDetails: sellerNew,
        }
    }

    async componentDidMount() {
        axios.post("http://localhost:3003/api/transactions/getSellerTransactions",{
            sellerId:this.state.profileDetails._id
        })
            .then(response => {
                const transactions = response.data.Transactions
                let newTransactions = []
                for(let i=0;i<transactions.length;i++){
                    newTransactions.push(transactions[i])
                }
                this.setState({
                    transactions:newTransactions
                },() => {
                    console.log("Trans",this.state.transactions)
                })
            })
    }

    render() {
        const {transactions} = this.state;
        if(this.state.reDirectToSellerHomePage){
            return <Navigate to="/sellerHomePage"/>
        }else{
            return (
                <div className="sellerOldTransactions_main">
                    <div className="sellerOldTransactions_sub">
                        <div className="dynamicSellerOldTransactionsComponent">
                            <h1 className="sellerOldTransactions_title">All the Transactions</h1>
                            <input className="sellerOldTransactions_search" type="text" placeholder="search" onChange={event => {
                                this.setState({
                                    searchTerm: event.target.value
                                })
                            }}/>
                            <div className="dynamicSellerOldTransactions">
                                <div className="sellerTransactionsScroll hides">
                                    <table className="sellerOldTransactionsTable">
                                        <tbody>
                                        <tr className="sellerOldTransactions_head">
                                            <th className="sellerOldTransactions_table_header_column">Name</th>
                                            <th className="sellerOldTransactions_table_header_column">Quantity</th>
                                            <th className="sellerOldTransactions_table_header_column">Total Cost</th>
                                            <th className="sellerOldTransactions_table_header_column">Status</th>
                                        </tr>

                                        {(transactions.length > 0) ? transactions.filter((val) => {
                                            if (this.state.searchTerm == "") {
                                                return val;
                                            } else if (val.CoinDetails.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                                                return val;
                                            } else if (val.SellerDetails.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                                                return val;
                                            }
                                        }).map((transaction, index) => {
                                            return (
                                                <tr className="sellerOldTransactions_table_data_odd" key={index}>
                                                    <td className="sellerOldTransactions_table_data_column">{transaction.CoinDetails.name}</td>
                                                    <td className="sellerOldTransactions_table_data_column">{transaction.TransactionDetails.quantity}</td>
                                                    <td className="sellerOldTransactions_table_data_column">{transaction.TransactionDetails.totalCost}</td>
                                                    <td className="sellerOldTransactions_table_data_column">{transaction.TransactionDetails.status}</td>
                                                </tr>
                                            )
                                        }) : <tr>
                                            <td className="sellerOldTransactions_table_data_column">Loading...</td>
                                        </tr>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="sellerTransactions_buttonMenu">
                                <div className="sellerTransactions_button" onClick={() => {
                                    this.setState({reDirectToSellerHomePage: true})}}>
                                    <h6 className="sellerTransactions_Text">Back to Seller Home Page</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default SellerOldTransactions;