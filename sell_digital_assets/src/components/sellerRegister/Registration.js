import React, {Component} from 'react';
import './Registration.css'
import {Navigate} from "react-router-dom";

const axios = require('axios').default;


class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            regDetails: {
                name: "", familyName: "", country: "",
                telephoneNumber: "", bankName: "", accountNumber: "", wiseAccountNumber: "", email: "",
                password: "", emailVerified: false, accountApproved: false, avatar: ""
            },
            confirmPassword:"",
            reDirectVerifyEmail: false,
            reDirectLogin: false,
            error: ""
        }
    }


    Auth = (event) => {
        event.preventDefault();
        if (this.state.regDetails.email === "" || this.state.regDetails.password === "" || this.state.regDetails.name === "" ||
            this.state.regDetails.familyName === "" || this.state.regDetails.country === "" || this.state.regDetails.telephoneNumber === "" ||
            this.state.regDetails.bankName === "" || this.state.regDetails.accountNumber === "" ||
            this.state.regDetails.wiseAccountNumber === "") {
            this.setState({error: "Please Fill all Required Fields"})
        } else {
            if(this.state.confirmPassword===this.state.regDetails.password){
                if(this.state.regDetails.password.length>=8){
                    axios.post("http://localhost:3003/api/user/signup", {
                        name: this.state.regDetails.name,
                        familyName: this.state.regDetails.familyName,
                        country: this.state.regDetails.country,
                        telephoneNumber: this.state.regDetails.telephoneNumber,
                        bankName: this.state.regDetails.bankName,
                        accountNumber: this.state.regDetails.accountNumber,
                        wiseAccountNumber: this.state.regDetails.wiseAccountNumber,
                        email: this.state.regDetails.email,
                        password: this.state.regDetails.password,
                        emailVerified: false,
                        accountApproved: false,
                        avatar: ""
                    }).then(response2 => {
                        const data = response2.data.Status
                        const message = response2.data.Message
                        if (data === "Unsuccessful") {
                            this.setState({error: message})
                        } else {
                            this.setState({reDirectVerifyEmail: true, error: response2})
                            localStorage.setItem('seller', JSON.stringify(response2))
                        }
                    }).catch(err => {
                        this.setState({error: "An error occurred."})
                    });
                }else{
                    this.setState({error: "Password must have at least 8 characters."})
                }
            }else{
                this.setState({error: "Password and confirm password does not match."})
            }
        }
    }

    render() {
        if (this.state.reDirectVerifyEmail) {
            return <Navigate to="/verificationEmail"/>
        } else if (this.state.reDirectLogin) {
            return <Navigate to="/"/>
        } else {
            return (
                <div className="pos">
                    <div className="regForm">
                        <div className="subRegImageForm"></div>
                        <form onSubmit={this.Auth} className="subRegForm">
                            <h1 className="regFormTitle">REGISTRATION</h1>
                            <h6 className="regFormDesc">Sell your Digital Assets</h6>
                            <div className=" offset-2  text-danger">{this.state.error}</div>
                            <div className="form-group regFormTextBox ">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({regDetails: {...this.state.regDetails, name: e.target.value}})
                                    }
                                    value={this.state.regDetails.name}
                                    type="text"
                                    placeholder="Name"
                                />
                            </div>
                            <div className="form-group regFormTextBox ">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({
                                            regDetails: {
                                                ...this.state.regDetails,
                                                familyName: e.target.value
                                            }
                                        })
                                    }
                                    value={this.state.regDetails.familyName}
                                    type="text"
                                    placeholder="Family Name"
                                />
                            </div>

                            <div className="form-group regFormTextBox ">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({regDetails: {...this.state.regDetails, country: e.target.value}})
                                    }
                                    value={this.state.regDetails.country}
                                    type="text"
                                    placeholder="Country"
                                />
                            </div>
                            <div className="form-group regFormTextBox ">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({
                                            regDetails: {
                                                ...this.state.regDetails,
                                                telephoneNumber: e.target.value
                                            }
                                        })
                                    }
                                    value={this.state.regDetails.telephoneNumber}
                                    type="number"
                                    placeholder="Telephone Number"
                                />
                            </div>
                            <div className="form-group regFormTextBox">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({
                                            regDetails: {
                                                ...this.state.regDetails,
                                                bankName: e.target.value
                                            }
                                        })
                                    }
                                    value={this.state.regDetails.bankName}
                                    type="text"
                                    placeholder="Bank Name"
                                />
                            </div>
                            <div className="form-group regFormTextBox ">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({
                                            regDetails: {
                                                ...this.state.regDetails,
                                                accountNumber: e.target.value
                                            }
                                        })
                                    }
                                    value={this.state.regDetails.accountNumber}
                                    type="number"
                                    placeholder="Account Number"
                                />
                            </div>
                            <div className="form-group regFormTextBox ">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({
                                            regDetails: {
                                                ...this.state.regDetails,
                                                wiseAccountNumber: e.target.value
                                            }
                                        })
                                    }
                                    value={this.state.regDetails.wiseAccountNumber}
                                    type="number"
                                    placeholder="Wise Account Number"
                                />
                            </div>
                            <div className="form-group regFormTextBox">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({regDetails: {...this.state.regDetails, email: e.target.value}})
                                    }
                                    value={this.state.regDetails.email}
                                    type="email"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="form-group regFormTextBox">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({
                                            regDetails: {
                                                ...this.state.regDetails,
                                                password: e.target.value
                                            }
                                        })
                                    }
                                    value={this.state.regDetails.password}
                                    type="password"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="form-group regFormTextBox">
                                <input
                                    className="regFormTextInput"
                                    onChange={(e) =>
                                        this.setState({
                                            confirmPassword:e.target.value
                                        })
                                    }
                                    value={this.state.confirmPassword}
                                    type="password"
                                    placeholder="Confirm Password"
                                />
                            </div>
                            <br/>
                            <div className="regFormTextBox">
                                <input
                                    type="submit"
                                    className="regButton"
                                    value="Register"
                                />
                            </div>

                            <input
                                type="button"
                                onClick={() => this.setState({reDirectLogin: true})}
                                className="gotoRegisterButton"
                                value="Already have an account? Login here"
                            />
                        </form>
                    </div>
                </div>
            );
        }
    }
}

export default Registration