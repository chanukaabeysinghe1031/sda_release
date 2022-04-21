import React, {Component} from 'react';
import './adminSettings.css'
import {Navigate} from "react-router-dom";
const axios = require('axios').default;

class AdminSettings extends Component {
    constructor(props) {
        super(props);
        const admin = localStorage.getItem("admin");
        const adminParsed = JSON.parse(admin);
        this.state = {
            reDirectToDashBoard: false,
            email: '',
            oldPassword:'',
            newPassword:"",
            confirmPassword:"",
            error:"",
            error2:"",
            admin:adminParsed
        }
    }

    onEmailSubmit = (e) =>{
        e.preventDefault()
        if(this.state.email===""){
            this.setState({error:"Please enter the new email address."})
        }else{
            console.log(this.state.admin)
            axios.post('http://localhost:3003/api/admin/adminChangeEmail',{
                adminId:this.state.admin._id,
                emailAddress:this.state.email
            })
                .then(response => {
                    const status = response.data.Status
                    if (status === "Successful") {
                        const message = response.data.Message
                        this.setState({
                            error: message,
                        })
                    }else{
                        const message = response.data.Message
                        this.setState({
                            error: message
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        error: error
                    })
                })
        }
    }

    onPasswordSubmit = (e) =>{
        e.preventDefault()
        if(this.state.oldPassword===""||this.state.newPassword===""||this.state.confirmPassword===""){
            this.setState({error2:"Please complete the all the fields."})
        }else{
            console.log(this.state.admin)
            axios.post('http://localhost:3003/api/admin/adminUpdatePassword',{
                adminId:this.state.admin._id,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            })
                .then(response => {
                    const status = response.data.Status
                    if (status === "Successful") {
                        const message = response.data.Message
                        this.setState({
                            error2: message,
                        })
                    }else{
                        const message = response.data.Message
                        this.setState({
                            error2: message
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        error2: error
                    })
                })
        }
    }


    render() {
        if (this.state.reDirectToTransactions) {
            return <Navigate to="/adminDashBoard"/>
        }else{
            return (
                <div className="adminSettings_main">
                    <div className="adminSettings_sub">
                        <div className="dynamicSettingsComponent">
                            <div className="changeEmailComponent">
                                <h1 className="adminForm_title">Change Email Address</h1>
                                <form className="settingsForm" onSubmit={this.onEmailSubmit}>
                                    <div className="settingsInputContainer">
                                        <label className="settings_label">
                                            New Email Address
                                        </label>
                                        <input
                                            value={this.state.email}
                                            className="settingsTextInput"
                                            type="email"
                                            onChange={e => {
                                                this.setState({
                                                    email: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="settingsInputContainer">
                                        <div className="settings_error_message">{this.state.error}</div>
                                    </div>
                                    <div className="settingsInputContainer">
                                        <input
                                            type="submit"
                                            className="settings_button"
                                            value="Update Email"
                                        />
                                    </div>
                                    <div className="adminSettingsDashboardButton"
                                         onClick={() => this.setState({reDirectToTransactions: true})}>
                                        <h7 className="adminSettingsGoToDashboardButton">Go To Dashboard</h7>
                                    </div>
                                </form>
                            </div>
                            <div className="changePasswordComponent">
                                <h1 className="adminForm_title">Change Password</h1>
                                <form className="settingsForm" onSubmit={this.onPasswordSubmit}>
                                    <div className="settingsInputContainer">
                                        <label className="settings_label">
                                            Old Password
                                        </label>
                                        <input
                                            value={this.state.oldPassword}
                                            className="settingsTextInput"
                                            type="password"
                                            onChange={e => {
                                                this.setState({
                                                    oldPassword: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="settingsInputContainer">
                                        <label className="settings_label">
                                            New Password
                                        </label>
                                        <input
                                            value={this.state.newPassword}
                                            className="settingsTextInput"
                                            type="password"
                                            onChange={e => {
                                                this.setState({
                                                    newPassword: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="settingsInputContainer">
                                        <label className="settings_label">
                                            Confirm Password
                                        </label>
                                        <input
                                            value={this.state.confirmPassword}
                                            className="settingsTextInput"
                                            type="password"
                                            onChange={e => {
                                                this.setState({
                                                    confirmPassword: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="settingsInputContainer">
                                        <div className="settings_error_message">{this.state.error2}</div>
                                    </div>
                                    <div className="settingsInputContainer">
                                        <input
                                            type="submit"
                                            className="settings_button"
                                            value="Update Password"
                                        />
                                    </div>
                                    <div className="adminSettingsDashboardButton"
                                         onClick={() => this.setState({reDirectToTransactions: true})}>
                                        <h7 className="adminSettingsGoToDashboardButton">Go To Dashboard</h7>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default AdminSettings;