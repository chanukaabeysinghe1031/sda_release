import React, {Component, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./homepage.css";
import {Navigate} from "react-router-dom";
const axios = require('axios').default;

class SellerHomePage extends Component {
    constructor(props) {
        super(props);

        const seller = localStorage.getItem("user");
        const sellerParsed = JSON.parse(seller);
        const sellerNew = sellerParsed
        console.log("Local Storage Seller", sellerParsed)


        this.state = {
            coins:[],
            searchTerm:'',
            seller:sellerNew,
            reDirectToConfirmation:false,
            reDirectToLogin:false,
            reDirectToProfilePage:false,
            reDirectToOldTransactions:false,
            selectedCoin:null,
            menuStyle:"hideSellerMenu"
        }
    }

    async componentDidMount() {
        axios.get('http://localhost:3003/api/coins/getCoins')
            .then((res) => {
                const coins = res.data.Coins
                this.setState({coins: coins}, () => console.log("Seller", this.state.seller))
            })
            .catch(error => {
                alert("Network Error")
            })
    }

    render() {
        const {coins}  =  this.state;
        console.log(this.state.seller.avatar)
        if(this.state.reDirectToConfirmation===true){
            return <Navigate to="/sellingConfirmation"/>
        }else if(this.state.reDirectToLogin===true){
            return <Navigate to="/sellerLogin"/>
        }else if(this.state.reDirectToProfilePage){
            return <Navigate to="/sellerProfilePage"/>
        }else if(this.state.reDirectToOldTransactions){
            return <Navigate to="/sellerOldTransactions"/>
        }else{
            return (
                <div className="seller_dashBoard_main">
                    <div className="row justify-content-end">
                        <div className="avatarContainer" onClick={()=>{
                            if(this.state.menuStyle==="displaySellerMenu"){
                                this.setState({menuStyle:"hideSellerMenu"})
                            }else{
                                this.setState({menuStyle:"displaySellerMenu"})
                            }
                        }}>
                            <img className="avatar" src={"http://localhost:3003/" + this.state.seller.avatar}/>
                        </div>

                        <div className={this.state.menuStyle}>
                            <div className="menuItem" onClick={()=>this.setState({reDirectToProfilePage:true})}>
                                <h7 >Profile</h7>
                            </div>
                            <div className="menuItem" onClick={()=>this.setState({reDirectToOldTransactions:true})}>
                                <h7>Old Transactions</h7>
                            </div>
                            <div className="menuItem" onClick={()=>{
                                localStorage.clear();
                                this.setState({reDirectToLogin:true})
                            }}>
                                <h7>Logout</h7>
                            </div>
                        </div>
                    </div>

                    <h3 className="title">Sell Your Digital Coins</h3>
                    <input className="seller_dashboard_search" type="text" placeholder="Search" onChange={event => {
                        this.setState({
                            searchTerm :event.target.value
                        })
                    }}/>


                    {/*<div className="row">*/}
                    <div className="mainhomecointainer">
                        <table className="adminOrdersTable">
                            <tbody className="col col-9">
                            {(coins.length > 0) ? coins.filter((val) => {
                                if (this.state.searchTerm == "") {
                                    return val;
                                } else if (
                                    val.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
                                ) {
                                    return val;
                                }
                            }).map((coin, i) => (
                                <tr className="admin_orders_table_data_odd" key={i}>
                                    <td>
                                        <div className="coindetails">
                                            <img src={"http://localhost:3003/" + coin.coinImage}  width="75px" height="75px"/>
                                        </div>
                                    </td>
                                    <td className="admin_orders_table_data_column" key='name'><h5 className="coindetails">{coin.name}</h5></td>
                                    <td className="admin_orders_table_data_column" key='price'><h6 className="coindetails">{coin.price}$</h6></td>
                                    <td className="admin_orders_table_data_column_buy" key='btn'>
                                        <button type="button" className="admin_orders_buyButton" onClick={() =>{
                                            localStorage.setItem('CoinSelectedBySeller', JSON.stringify(coin))
                                            this.setState({
                                                reDirectToConfirmation:true,
                                                selectedCoin:coin
                                            })
                                        }}>
                                            Sell
                                        </button>
                                    </td>

                                </tr>
                            )) : <tr>
                                <td colSpan="5">Loading...</td>
                            </tr>}
                            </tbody>
                        </table>
                    </div>

                    {/*</div>*/}
                </div>
            );
        }
    }

};

export default SellerHomePage;
