import React, {Component} from 'react';
import './adminSellers.css'
import {Navigate} from "react-router-dom";
import {forEach} from "react-bootstrap/ElementChildren";
const axios = require('axios').default;

class AdminSellers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reDirectToTransactions: false,
            reDirectToAddCoins: false,
            reDirectToDashBoard: false,
            reDirectToLogin:false,
            reDirectToSettings:false,
            currentSellers: [],
            newSellerRequests: [],
            selectedSeller: null,
            searchTermCurrentSellers: "",
            searchTermNewRequests: "",
            displayApproveButton :true
        }

    }

    async componentDidMount () {
        axios.get("http://localhost:3003/api/user/getSellerAccounts")
            .then(response => {
                const sellers = response.data.SellerAccounts
                let currentSellers = []
                let newSellers = []
                for(let i=0;i<sellers.length;i++){
                    if(sellers[i].emailVerified && sellers[i].accountApproved){
                        currentSellers.push(sellers[i])
                    }else if(sellers[i].emailVerified && sellers[i].accountApproved===false){
                        newSellers.push(sellers[i])
                    }
                }
                this.setState({
                    currentSellers : currentSellers,
                    newSellerRequests: newSellers
                },() => {
                    console.log("current",currentSellers)
                    console.log("new",newSellers)
                })
            })
    }

    approveSeller = () => {
        axios.post('http://localhost:3003/api/user/approveSellerAccount',{userId:this.state.selectedSeller._id})
            .then(response =>{
                const status = response.data.Status
                console.log(response)
                if(status === "Successful"){
                    const sellers = response.data.SellerAccounts
                    let currentSellers = []
                    let newSellers = []
                    for(let i=0;i<sellers.length;i++){
                        if(sellers[i].emailVerified && sellers[i].accountApproved){
                            currentSellers.push(sellers[i])
                        }else if(sellers[i].emailVerified && sellers[i].accountApproved===false){
                            newSellers.push(sellers[i])
                        }
                    }
                    this.setState({
                        currentSellers : currentSellers,
                        newSellerRequests: newSellers
                    },() => {
                        console.log("current",currentSellers)
                        console.log("new",newSellers)
                    })
                }else{
                    const message = response
                    alert(message)
                }
            })
    }

    render() {
        const {selectedSeller, newSellerRequests, currentSellers} = this.state;
        if (this.state.reDirectToTransactions) {
            return <Navigate to="/adminTransactions"/>
        } else if (this.state.reDirectToAddCoins) {
            return <Navigate to="/adminAddCoins" />
        } else if (this.state.reDirectToDashBoard) {
            return <Navigate to="/adminDashBoard"/>
        } else if(this.state.reDirectToLogin){
            return <Navigate to="/sellerLogin" />
        }else if(this.state.reDirectToSettings){
            return <Navigate to="/adminSettings" />
        }else {
            return (
                <div className="adminSellers_main">
                    <div className="adminSellers_sub">
                        <div className="dynamicSellersComponent">
                            <div className="dynamicSellers">
                                <div className="currentSellersComponent">
                                    <h5 className="adminSellers_title">Current Sellers</h5>
                                    <input className="admin_sellers_search" type="text" placeholder="search"
                                           onChange={event => {
                                               this.setState({
                                                   searchTermCurrentSellers: event.target.value
                                               })
                                           }}/>
                                    {(currentSellers.length > 0) ? currentSellers.filter((val) => {
                                        if (this.state.searchTermCurrentSellers === "" ) {
                                            console.log("Seller",val)
                                            return val;
                                        } else if (val.name.toLowerCase().includes(this.state.searchTermCurrentSellers.toLowerCase()) ||
                                            val.familyName.toLowerCase().includes(this.state.searchTermCurrentSellers.toLowerCase())
                                        ) {
                                            return val;
                                        } else if (val.name.toLowerCase().includes(this.state.searchTermCurrentSellers.toLowerCase()) ||
                                            val.name.toLowerCase().includes(this.state.searchTermCurrentSellers.toLowerCase())
                                        ) {
                                            return val;
                                        }
                                    }).map(seller => {
                                        return (
                                            <div className="sellerComponent" key={seller._id} onClick={() => {
                                                this.setState({
                                                    selectedSeller :seller
                                                })
                                            }}>
                                                <h1 className="adminSeller_name">{seller.name} {seller.familyName}</h1>
                                            </div>
                                        )
                                    }) : <h1 className="adminSeller_name">No current sellers.</h1>
                                    }
                                </div>
                                <div className="currentSellersComponent">
                                    <h5 className="adminSellers_title">New Seller Requests</h5>
                                    <input className="admin_sellers_search" type="text" placeholder="search"
                                           onChange={event => {
                                               this.setState({
                                                   searchTermNewRequests: event.target.value
                                               })
                                           }}/>
                                    {(newSellerRequests.length > 0) ? newSellerRequests.filter((val) => {
                                        if (this.state.searchTermNewRequests === "") {
                                            return val;
                                        } else if (val.name.toLowerCase().includes(this.state.searchTermNewRequests.toLowerCase()) ||
                                            val.familyName.toLowerCase().includes(this.state.searchTermNewRequests.toLowerCase())
                                        ) {
                                            return val;
                                        } else if (val.name.toLowerCase().includes(this.state.searchTermNewRequests.toLowerCase()) ||
                                            val.name.toLowerCase().includes(this.state.searchTermNewRequests.toLowerCase())
                                        ) {
                                            return val;
                                        }
                                    }).map(seller => {
                                        return (
                                            <div className="sellerComponent" key={seller._id} onClick={() => {
                                                this.setState({
                                                    selectedSeller :seller
                                                })
                                            }}>
                                                <h1 className="adminSeller_name">{seller.name} {seller.familyName}</h1>
                                            </div>
                                        )
                                    }) : <h1 className="adminSeller_name">No new seller requests</h1>
                                    }
                                </div>
                                <div className="selectedSellerComponent">
                                    <h5 className="adminSelectedSeller_title">Selected Seller</h5>
                                    {
                                        selectedSeller ?
                                            <div className="selectedSellerDetailsComponent">
                                                <h7 className="adminSelectedSeller_details_header">Name</h7>
                                                <h7 className="adminSellercredSeller_details">{selectedSeller.name} {selectedSeller.familyName}</h7>
                                                <h7 className="adminSelectedSeller_details_header">Country</h7>
                                                <h7 className="adminSellercredSeller_details">{selectedSeller.country}</h7>
                                                <h7 className="adminSelectedSeller_details_header">Telephone Number</h7>
                                                <h7 className="adminSellercredSeller_details">{selectedSeller.telephoneNumber}</h7>
                                                <h7 className="adminSelectedSeller_details_header">Email</h7>
                                                <h7 className="adminSellercredSeller_details">{selectedSeller.email}</h7>
                                                <h7 className="adminSelectedSeller_details_header">Is Email Verified</h7>
                                                {selectedSeller.emailVerified ?
                                                    <h7 className="adminSellercredSeller_details">Yes</h7>
                                                    :
                                                    <h7 className="adminSellercredSeller_details">No</h7>
                                                }

                                                <h7 className="adminSelectedSeller_details_header">Is account Approved?</h7>
                                                {selectedSeller.accountApproved ?
                                                    <h7 className="adminSellercredSeller_details">Yes</h7>
                                                    :
                                                    <h7 className="adminSellercredSeller_details">No</h7>
                                                }
                                                <h7 className="adminSelectedSeller_details_header">Bank Name</h7>
                                                <h7 className="adminSellercredSeller_details">{selectedSeller.bankName}</h7>
                                                <h7 className="adminSelectedSeller_details_header">Account Number</h7>
                                                <h7 className="adminSellercredSeller_details">{selectedSeller.accountNumber}</h7>
                                                <h7 className="adminSelectedSeller_details_header">Wise Account Number</h7>
                                                <h7 className="adminSellercredSeller_details">{selectedSeller.wiseAccountNumber}</h7>

                                                {selectedSeller.emailVerified == true && selectedSeller.accountApproved == false ?
                                                    <div className="adminSellersApprove_button"
                                                         onClick={this.approveSeller}>
                                                        <h6 className="adminDashBoard_Text">Approve</h6>
                                                    </div> : null
                                                }
                                            </div> :
                                            <h7 className="adminSellercredSeller_details">No seller is selected.</h7>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="adminDashBoard_buttonMenu">
                            <div className="adminDashBoard_button"
                                 onClick={() => this.setState({reDirectToDashBoard: true})}>
                                <h6 className="adminDashBoard_Text">Dashboard</h6>
                            </div>
                            <div className="adminDashBoard_button"
                                 onClick={() => this.setState({reDirectToTransactions: true})}>
                                <h6 className="adminDashBoard_Text">Transactions</h6>
                            </div>
                            <div className="adminDashBoard_button"
                                 onClick={() => this.setState({reDirectToAddCoins: true})}>
                                <h6 className="adminDashBoard_Text">Coins</h6>
                            </div>
                            <div className="adminDashBoard_button" id="adminSellers"
                                 onClick={() => this.setState({reDirectToNewSellers: true})}>
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

export default AdminSellers;