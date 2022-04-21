import React, {Component} from 'react';
import './sellerProfilePage.css'
import {Navigate} from "react-router-dom";

const axios = require('axios').default;


class SellerProfilePage extends Component {

    constructor(props) {
        super(props);
        const seller = localStorage.getItem("user");
        const sellerParsed = JSON.parse(seller);
        const sellerNew = sellerParsed
        console.log("Local Storage Seller", sellerNew)

        this.state = {
            reDirectToHomePage: false,
            reDirectToLogin:false,
            profileDetails: sellerNew,
            updateProfileImageStyle: "displayProfileUpdate",
            updatePasswordStyle: "hideUpdatePassword",
            updateDetailsStyle: "hideUpdateDetails",
            deleteAccountStyle: "hideDeleteAccount",
            profileImage: "",
            error: "",
            oldPassword:"",
            newPassword:"",
            confirmPassword:"",
            country:"",
            telephoneNumber:"",
            bankName:"",
            accountNumber:""
        }
    }

    handleChange = event => {
        const fileUploaded = event.target.files[0];
        this.setState({
            profileImage: fileUploaded
        })
    };

    onImageSubmit = (e) => {
        e.preventDefault();
        if (this.state.profileImage === "") {
            this.setState({error: "Please select a profile image"})
        } else {
            const formData = new FormData();
            formData.append('sellerId', this.state.profileDetails._id)
            formData.append('profileImage', this.state.profileImage)

            axios.post('http://localhost:3003/api/user/updateProfileImage', formData)
                .then(response => {
                    const status = response.data.Status
                    const profileDetails = response.data.User
                    if (status === "Successful") {
                        localStorage.setItem('user', JSON.stringify(profileDetails))
                        this.setState({error: "Successfully updated the profile image.",profileDetails:profileDetails})
                    } else {
                        console.log(response)
                        this.setState({error: "Failed to update the profile image."})
                    }
                })
        }
    }

    onPasswordSubmit = (e) => {
        e.preventDefault();
        if(this.state.oldPassword===""||this.state.newPassword===""||this.state.confirmPassword===""){
            this.setState({error:"Please fill all the data."})
        }else{
            console.log(this.state.newPassword)
            console.log(this.state.confirmPassword)
            if(this.state.newPassword === this.state.confirmPassword){
                axios.post('http://localhost:3003/api/user/updatePassword', {
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword,
                    sellerId:this.state.profileDetails._id
                })
                    .then(response => {
                        const status = response.data.Status
                        const profileDetails = response.data.User
                        if (status === "Successful") {
                            console.log(response)
                            this.setState({
                                error: "Successfully updated the password.",
                                oldPassword:"",
                                newPassword:"",
                                confirmPassword:""
                            })
                        } else {
                            console.log(response)
                            this.setState({
                                error: "Failed to update the profile image.",
                                oldPassword:"",
                                newPassword:"",
                                confirmPassword:""
                            })
                        }
                    })
            }else{
                this.setState({error:"The password does not match."})
            }
        }
    }

    onDetailsSubmit = (e) =>{
        e.preventDefault()
        if(this.state.country===""&&this.state.telephoneNumber===""&&this.state.bankName===""&&
        this.state.accountNumber===""){
            this.setState({error:"Please fill the data you want to update."})
        }else{
            axios.post('http://localhost:3003/api/user/updateProfile', {
                sellerId:this.state.profileDetails._id,
                country:this.state.country,
                telephoneNumber:this.state.telephoneNumber,
                bankName:this.state.bankName,
                accountNumber: this.state.accountNumber
            })
                .then(response=>{
                    const status = response.data.Status
                    const profileDetails = response.data.User
                    if (status === "Successful") {
                        console.log(response)
                        localStorage.setItem('user', JSON.stringify(profileDetails))
                        this.setState({
                            error: "Successfully updated the profile.",
                            country:"",
                            telephoneNumber:"",
                            bankName:"",
                            accountNumber:"",
                            profileDetails:profileDetails
                        })
                    } else {
                        console.log(response)
                        this.setState({
                            error: "Failed to update the profile image.",
                            country:"",
                            telephoneNumber:"",
                            bankName:"",
                            accountNumber:""
                        })
                    }
                })
        }
    }

    onDeleteSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3003/api/user/deleteProfile', {
            sellerId : this.state.profileDetails._id
        })
            .then(response=>{
                const status = response.data.Status
                const profileDetails = response.data.User
                if (status === "Successful") {
                    localStorage.clear()
                    this.setState({
                        error: "Successfully updated the profile.",
                        reDirectToLogin:true
                    })
                } else {
                    this.setState({
                        error: "Failed to delete the profile."
                    })
                }
            })
    }
    render() {
        const hiddenFileInput = React.createRef(null);
        const handleClick = event => {
            hiddenFileInput.current.click();
        };

        const {profileDetails} = this.state
        if (this.state.reDirectToHomePage) {
            return <Navigate to="/sellerHomePage"/>
        } else if(this.state.reDirectToLogin){
            return <Navigate to="/sellerLogin"/>
        } else {
            return (
                <div className="seller_profile_mainComponent">
                    <div className="seller_profile_subComponent">
                        <div className="seller_profile_details">
                            <img className="seller_profileImage"
                                 src={"http://localhost:3003/" + profileDetails.avatar}/>
                            <h7 className="sellerProfile_title">{profileDetails.name} {profileDetails.familyName}</h7>
                            <h7 className="sellerProfile_smallData">{profileDetails.email}</h7>
                            <h7 className="sellerProfile_smallData">{profileDetails.telephoneNumber}</h7>
                            <div className="sellerProfileDataRow">
                                <h7 className="sellerProfileDataHeader">Country</h7>
                                <h7 className="sellerProfileData">{profileDetails.country}</h7>
                            </div>
                            <div className="sellerProfileDataRow">
                                <h7 className="sellerProfileDataHeader">Bank Name</h7>
                                <h7 className="sellerProfileData">{profileDetails.bankName}</h7>
                            </div>
                            <div className="sellerProfileDataRow">
                                <h7 className="sellerProfileDataHeader">Account Number</h7>
                                <h7 className="sellerProfileData">{profileDetails.accountNumber}</h7>
                            </div>
                            <div className="sellerProfileDataRow">
                                <h7 className="sellerProfileDataHeader">Wise Account Number</h7>
                                <h7 className="sellerProfileData">{profileDetails.wiseAccountNumber}</h7>
                            </div>
                            <div className="seller_profile_buttons_menu">
                                <div className="seller_profile_button"
                                     onClick={() => this.setState({
                                         updateProfileImageStyle: "displayProfileUpdate",
                                         updatePasswordStyle: "hideUpdatePassword",
                                         updateDetailsStyle: "hideUpdateDetails",
                                         deleteAccountStyle: "hideDeleteAccount"
                                     })}>
                                    <h7>Change Profile Image</h7>
                                </div>
                                <div className="seller_profile_button" onClick={() => this.setState({
                                    updateProfileImageStyle: "hideProfileUpdate",
                                    updatePasswordStyle: "displayUpdatePassword",
                                    updateDetailsStyle: "hideUpdateDetails",
                                    deleteAccountStyle: "hideDeleteAccount"
                                })}>
                                    <h7>Update Password</h7>
                                </div>
                            </div>
                            <div className="seller_profile_buttons_menu">
                                <div className="seller_profile_button" onClick={() => this.setState({
                                    updateProfileImageStyle: "hideProfileUpdate",
                                    updatePasswordStyle: "hideUpdatePassword",
                                    updateDetailsStyle: "displayUpdateDetails",
                                    deleteAccountStyle: "hideDeleteAccount"
                                })}>
                                    <h7>Update Details</h7>
                                </div>
                                <div className="seller_profile_button" onClick={() => {
                                    this.setState({reDirectToHomePage: true})}}>
                                    <h7>Back to Dashboard</h7>
                                </div>
                            </div>
                        </div>
                        <div className="seller_profile_update">
                            <div className={this.state.updateProfileImageStyle}>
                                <h1 className="sellerProfile_title">Update Profile Picture</h1>
                                <form className="updateProfileImageInputContainer">
                                    <div className="profileImageInput" onClick={handleClick}>
                                        Select the image from the files
                                    </div>
                                    <input type="file"
                                           ref={hiddenFileInput}
                                           onChange={this.handleChange}
                                           style={{display: 'none'}}
                                    />
                                    <div className="addCoinInputContainer">
                                        <input
                                            type="submit"
                                            className="sellerProfileButton"
                                            value="Update Profile Image"
                                            onClick={this.onImageSubmit}
                                        />
                                    </div>
                                    <h7 className="sellerProfileError">{this.state.error}</h7>
                                </form>
                            </div>
                            <div className={this.state.updatePasswordStyle}>
                                <h1 className="sellerProfile_title">Update Password</h1>
                                <form className="updateProfileImageInputContainer">
                                    <div className="sellerProfileInputContainer">
                                        <label className="sellerProfileLabel">
                                            Old Password
                                        </label>
                                        <input
                                            value={this.state.oldPassword}
                                            className="sellerProfileTextInput"
                                            type="password"
                                            onChange={e => {
                                                this.setState({
                                                    oldPassword: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="sellerProfileInputContainer">
                                        <label className="sellerProfileLabel">
                                            New Password
                                        </label>
                                        <input
                                            value={this.state.newPassword}
                                            className="sellerProfileTextInput"
                                            type="password"
                                            onChange={e => {
                                                this.setState({
                                                    newPassword: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="sellerProfileInputContainer">
                                        <label className="sellerProfileLabel">
                                            Confirm New Password
                                        </label>
                                        <input
                                            value={this.state.confirmPassword}
                                            className="sellerProfileTextInput"
                                            type="password"
                                            onChange={e => {
                                                this.setState({
                                                    confirmPassword: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="sellerProfileInputContainer">
                                        <input
                                            type="submit"
                                            className="sellerProfileButton"
                                            value="Update Password"
                                            onClick={this.onPasswordSubmit}
                                        />
                                    </div>
                                    <h7 className="sellerProfileError">{this.state.error}</h7>
                                </form>
                            </div>
                            <div className={this.state.updateDetailsStyle}>
                                <h1 className="sellerProfile_title">Update Profile Details</h1>
                                <form className="updateProfileImageInputContainer">
                                    <div className="sellerProfileInputContainer">
                                        <label className="sellerProfileLabel">
                                            Country
                                        </label>
                                        <input
                                            value={this.state.country}
                                            className="sellerProfileTextInput"
                                            type="text"
                                            onChange={e => {
                                                this.setState({
                                                    country: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="sellerProfileInputContainer">
                                        <label className="sellerProfileLabel">
                                            Telephone Number
                                        </label>
                                        <input
                                            value={this.state.telephoneNumber}
                                            className="sellerProfileTextInput"
                                            type="number"
                                            onChange={e => {
                                                this.setState({
                                                    telephoneNumber: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="sellerProfileInputContainer">
                                        <label className="sellerProfileLabel">
                                            Bank Name
                                        </label>
                                        <input
                                            value={this.state.bankName}
                                            className="sellerProfileTextInput"
                                            type="text"
                                            onChange={e => {
                                                this.setState({
                                                    bankName: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="sellerProfileInputContainer">
                                        <label className="sellerProfileLabel">
                                            Account Number
                                        </label>
                                        <input
                                            value={this.state.accountNumber}
                                            className="sellerProfileTextInput"
                                            type="number"
                                            onChange={e => {
                                                this.setState({
                                                    accountNumber: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="sellerProfileInputContainer">
                                        <input
                                            type="submit"
                                            className="sellerProfileButton"
                                            value="Update Profile"
                                            onClick={this.onDetailsSubmit}
                                        />
                                    </div>
                                    <h7 className="sellerProfileError">{this.state.error}</h7>
                                </form>
                            </div>
                            <div className={this.state.deleteAccountStyle}>
                                <h1 className="sellerProfile_title">Delete Account</h1>
                                <div className="updateProfileImageInputContainer">
                                    <h7 className="sellerProfileError">Do you really want to delete the account.</h7>
                                    <h7 className="sellerProfileError">
                                        Please be informed that this process can be undone and your account will be permanently
                                        deleted with your data.
                                    </h7>
                                    <h7 className="sellerProfileError"> If you want to connect with us again,
                                        you will have to crate an account.</h7>
                                    <h7 className="sellerProfileError">Thank you very much for being with us and
                                        selling digital currencies.</h7>
                                    <div className="sellerProfileInputContainer">
                                        <input
                                            type="submit"
                                            className="sellerProfileButton"
                                            value="Delete Profile"
                                            onClick={this.onDeleteSubmit}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default SellerProfilePage;