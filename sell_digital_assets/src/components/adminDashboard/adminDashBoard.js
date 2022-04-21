import React, {Component} from 'react';
import './adminDashBoard.css'
import {Navigate} from "react-router-dom";
const axios = require('axios').default;

class AdminDashBoard extends Component {

    state = {
        reDirectToTransactions : false,
        reDirectToAddCoins :false,
        reDirectToNewSellers :false,
        reDirectToLogin:false,
        reDirectToAdminBuyCoin: false,
        reDirectToSettings:false,
        transactions: [],
        searchTerm: '',
        adminDashBoard_buttonMenu : "displayAdmin_DashBoard_Button_Menu",
        menuButton : "hideMenuButton"
    }

    async componentDidMount() {
        axios.get("http://localhost:3003/api/transactions/getAllTransactions")
            .then(response => {
                const transactions = response.data.Transactions
                let newTransactions = []
                for(let i=0;i<transactions.length;i++){
                    if(transactions[i].TransactionDetails.status==="New Transaction"){
                        newTransactions.push(transactions[i])
                    }
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
        if(this.state.reDirectToTransactions){
            return <Navigate to="/adminTransactions"/>
        }else if(this.state.reDirectToAddCoins){
            return <Navigate to="/adminAddCoins" />
        }else if(this.state.reDirectToNewSellers){
            return <Navigate to="/adminSellers" />
        }else if(this.state.reDirectToLogin){
            return <Navigate to="/sellerLogin" />
        }else if(this.state.reDirectToAdminBuyCoin){
            return <Navigate to="/adminBuyCoin" />
        }else if(this.state.reDirectToSettings){
            return <Navigate to="/adminSettings" />
        }else{
            return (
                <div className="adminDashBoard_main">
                    <div className="adminDashBoard_sub">
                        <div className="dynamicComponent">
                            <h1 className="adminDashBoard_title">Selling Requests from the Sellers</h1>
                            <input className="admin_dashboard_search" type="text" placeholder="search" onChange={event => {
                                this.setState({
                                    searchTerm: event.target.value
                                })
                            }}/>
                            <div className="dynamicDashBoard">
                                <div className="adminOrdersScroll hides">
                                    <table className="adminOrdersTable">
                                        <tbody>
                                        <tr className="tasks_table_head">
                                            <th></th>
                                            <th className="admin_orders_table_header_column">Name</th>
                                            <th className="admin_orders_table_header_column">Seller</th>
                                            <th className="admin_orders_table_header_column">Quantity</th>
                                            <th className="admin_orders_table_header_column"></th>
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
                                                    <tr className="admin_orders_table_data_odd" key={index}>
                                                        <td>
                                                            <div className="coindetails">
                                                                <img src={"http://localhost:3003/" + transaction.CoinDetails.coinImage}
                                                                     width="75px" height="75px"/>
                                                            </div>
                                                        </td>
                                                        <td className="admin_orders_table_data_column">{transaction.CoinDetails.name}</td>
                                                        <td className="admin_orders_table_data_column">
                                                            {transaction.SellerDetails.name}
                                                            {transaction.SellerDetails.familyName}
                                                        </td>
                                                        <td className="admin_orders_table_data_column">{transaction.TransactionDetails.quantity}</td>
                                                        <td className="admin_orders_table_data_column_buy">
                                                            <div
                                                                className="admin_orders_buyButton"
                                                                onClick={() =>{
                                                                    localStorage.setItem('SelectedTransactionDetails', JSON.stringify(transaction))
                                                                    this.setState({reDirectToAdminBuyCoin : true})
                                                                }}
                                                            >
                                                                Buy
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                        }) : <tr>
                                            <td className="admin_orders_table_data_column">Loading...</td>
                                        </tr>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="adminDashBoard_buttonMenu">
                            <div className="adminDashBoard_button" id="adminDashboard" onClick={() => this.setState({})}>
                                <h6 className="adminDashBoard_Text">Dashboard</h6>
                            </div>
                            <div className="adminDashBoard_button"
                                 onClick={() =>this.setState({reDirectToTransactions:true})}>
                                <h6 className="adminDashBoard_Text">Transactions</h6>
                            </div>
                            <div className="adminDashBoard_button"
                                 onClick={() =>this.setState({reDirectToAddCoins:true})}>
                                <h6 className="adminDashBoard_Text">Coins</h6>
                            </div>
                            <div className="adminDashBoard_button"
                                 onClick={() =>this.setState({reDirectToNewSellers:true})}>
                                <h6 className="adminDashBoard_Text">Seller Accounts</h6>
                            </div>
                            <div className="adminDashBoard_button" id="settingsButton"
                                 onClick={() => this.setState({reDirectToSettings: true})}>
                                <h6 className="adminDashBoard_Text">Settings</h6>
                            </div>
                            <div className="adminDashBoard_button" id="logOutButton"
                                 onClick={() => this.setState({reDirectToLogin: true})}>
                                <h6 className="adminDashBoard_Text">Logout</h6>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default AdminDashBoard;