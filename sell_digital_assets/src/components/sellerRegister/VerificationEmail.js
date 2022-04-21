import React, {Component} from 'react';
import './VerificationEmail.css'
import {Button} from "react-bootstrap";
import {Navigate} from "react-router-dom";

const axios = require('axios').default;

class VerificationEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otp: "",
            successBox: "hideSuccessBox",
            errorBox: "hideErrorBox",
            error: "",
            seller: null,
            reDirectToSignUp : false,
            reDirectToSignin :false
        }
    }

    componentDidMount() {
        const seller = localStorage.getItem("seller");
        const sellerParsed = JSON.parse(seller);
        this.setState({seller: sellerParsed})
        console.log("Local Storage Seller", sellerParsed)
    }

    verifyEmail = (event) => {
        event.preventDefault();
        const userId = this.state.seller.data.User._id
        if (this.state.otp === "") {
            this.setState({error: "Please enter OTP"})
        } else {
            console.log(userId)
            axios.post("http://localhost:3003/api/user/verifyEmail", {
                userId: userId,
                otp: this.state.otp
            })
                .then(response2 => {
                    console.log(response2)
                    const status = response2.data.Status
                    const message = response2.data.Message
                    if(status==="Unsuccessful"){
                        this.setState({errorBox:"displayErrorBox",error:message})
                    }else{
                        this.setState({successBox: "displaySuccessBox",errorBox:"hideErrorBox"})
                    }
                })
                .catch(error=>{
                    this.setState({errorBox:"displayErrorBox"})
                })
        }
    }

    resendOtp = (event) => {
        event.preventDefault()
        const userId = this.state.seller.data.User._id
        axios.post("http://localhost:3003/api/user/resendToken", {
            userId: userId
        })
            .then(response2 => {
                console.log("dsafdsa")
                const status = response2.data.Status
                const message = response2.data.Message
                if(status==="Unsuccessful"){
                    console.log("Unsuccessful")
                    this.setState({errorBox:"displayErrorBox",error:message})
                }else{
                    console.log("Successful")
                    this.setState({errorBox: "displayErrorBox",error:message})
                }
            })
            .catch(error=>{
                this.setState({errorBox:"displayErrorBox"})
            })
    }

    goToLoginPage = () => {
        this.setState({reDirectToSignin : true})
    }

    render() {
        if(this.state.reDirectToSignUp){

        }else if(this.state.reDirectToSignin){
            return <Navigate to="/sellerLogin" />
        }else{
            return (
                <div className="verification_main">
                    <div className="verification_sub">
                        <h1 className="verification_title">Please enter the OTP which was received to your email
                            address.</h1>
                        <form onSubmit={this.verifyEmail} className="verifyEmailForm">
                            <input
                                className="verifyEmailTextBox"
                                type="number"
                                placeholder="OTP"
                                onChange={(e) =>
                                    this.setState({otp: e.target.value})
                                }
                                value={this.state.otp}
                            />
                            <input
                                type="submit"
                                className="verifyEmailButton"
                                value="Verify Email"
                            />
                            <div className="goToLoginPageButton" onClick={this.goToLoginPage}>
                                Go to login page.
                            </div>
                        </form>
                        <div className={this.state.successBox}>
                            <h5>Your email has been successfully verified. An email will be received once
                                your seller account is approved.</h5>
                        </div>
                        <div className={this.state.errorBox}>
                            <h5>{this.state.error}</h5>
                            <div className="resendOTPButton" onClick={this.resendOtp}>
                                Resend the OTP.
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default VerificationEmail;