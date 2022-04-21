import React, {Component} from 'react';
import './adminAddCoins.css'
import {Navigate} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const axios = require('axios').default;

class AdminAddCoins extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reDirectToNewSellers: false,
            reDirectToTransactions: false,
            reDirectToDashBoard: false,
            reDirectToLogin:false,
            reDirectToSettings:false,
            name: '',
            price: '',
            coinImage: '',
            coins: [],
            error: ''
        }
    }

    async componentDidMount() {
        axios.get('http://localhost:3003/api/coins/getCoins')
            .then((res) => {
                const coins = res.data.Coins
                this.setState({coins: coins}, () => console.log("COINS", this.state.coins))
            })
            .catch(error => {
                alert("Network Error")
            })
    }

    handleChange = event => {
        const fileUploaded = event.target.files[0];
        this.setState({
            coinImage: fileUploaded
        })
    };

    onFormSubmit = (e) => {
        e.preventDefault();

        if (this.state.name === "" || this.state.price == null || this.state.coinImage === null) {
            this.setState({
                error: "Please enter all the data."
            })
        } else {
            const formData = new FormData();
            formData.append('name', this.state.name)
            formData.append('coinImage', this.state.coinImage)
            formData.append('price', this.state.price)
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post('http://localhost:3003/api/coins/addCoin', formData)
                .then(response => {
                    const status = response.data.Status
                    if (status === "Successful") {
                        const message = response.data.Message
                        const newCoin = response.data.Coin
                        let updatedCoins = this.state.coins
                        updatedCoins.push(newCoin)
                        this.setState({
                            error: message,
                            name: '',
                            coinImage: null,
                            price: '',
                            coins:updatedCoins
                        })
                    } else {
                        const message = response.data.Message
                        this.setState({
                            error: message
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        error: "The message "
                    })
                })
        }
    }

    render() {
        const {coins} = this.state;
        const hiddenFileInput = React.createRef(null);
        const handleClick = event => {
            hiddenFileInput.current.click();
        };

        if (this.state.reDirectToNewSellers) {
            return <Navigate to="/adminSellers"/>
        } else if (this.state.reDirectToTransactions) {
            return <Navigate to="/adminTransactions"/>
        } else if (this.state.reDirectToDashBoard) {
            return <Navigate to="/adminDashBoard"/>
        }else if(this.state.reDirectToLogin){
            return <Navigate to="/sellerLogin" />
        }else if(this.state.reDirectToSettings){
            return <Navigate to="/adminSettings" />
        } else {
            return (
                <div className="adminAddCoins_main">
                    <div className="adminAddCoins_sub">
                        <div className="dynamicCoinsComponent">
                            <div className="addCoinsComponent">
                                <h1 className="adminAddCoins_title">Add Coins</h1>
                                <form className="addCoinForm" onSubmit={this.onFormSubmit}>
                                    <div className="addCoinInputContainer">
                                        <label className="add_coin_label">
                                            Coin Name
                                        </label>
                                        <input
                                            value={this.state.name}
                                            className="addCoinTextInput"
                                            type="text"
                                            onChange={e => {
                                                this.setState({
                                                    name: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="addCoinInputContainer">
                                        <label className="add_coin_label">
                                            Price (USD)
                                        </label>
                                        <input
                                            value={this.state.price}
                                            className="addCoinTextInput"
                                            type="number"
                                            onChange={e => {
                                                this.setState({
                                                    price: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="addCoinInputContainer">
                                        <label className="add_coin_label">
                                            Coin Image
                                        </label>
                                        <div className="coinImageInput" onClick={handleClick}>
                                            Select the image from the files
                                        </div>
                                        <input type="file"
                                               ref={hiddenFileInput}
                                               onChange={this.handleChange}
                                               style={{display: 'none'}}
                                        />
                                    </div>

                                    <div className="addCoinInputContainer">
                                        <input
                                            type="submit"
                                            className="addCoin_button"
                                            value="Add Coin"
                                        />
                                    </div>
                                    <div className="addCoinInputContainer">
                                        <div className="addCoin_error_message">{this.state.error}</div>
                                    </div>
                                </form>
                            </div>
                            <div className="displayCoinsComponent">
                                <h1 className="adminAddCoins_title">Currently Added Coins</h1>
                                <Grid container className="adminDisplayCoinsList">
                                    {
                                        coins.map(coin => {
                                            return (
                                                <Grid key={coin._id} item xs={12} md={6} lg={4} className="adminDisplayCoinsListItem">
                                                    <div className="coins_paper">
                                                        {
                                                            coin.coinImage != "" ?
                                                                <img className="adminCoins_coin_image"
                                                                     src={"http://localhost:3003/" + coin.coinImage} alt="No image"/>
                                                                : <div></div>
                                                        }
                                                        <h3 className="adminCoinsName">{coin.name}</h3>
                                                        <h3 className="adminCoinsPrice">{coin.price}$</h3>
                                                    </div>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
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
                            <div className="adminDashBoard_button" id="adminCoins"
                                 onClick={() => this.setState({reDirectToAddCoins: true})}>
                                <h6 className="adminDashBoard_Text">Coins</h6>
                            </div>
                            <div className="adminDashBoard_button"
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

export default AdminAddCoins;