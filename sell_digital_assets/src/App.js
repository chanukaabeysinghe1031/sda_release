import { useState, useEffect } from "react";
import './App.css';
import SellerHomePage from "./components/sellerHomePage/SellerHomePage";
import AdminDashBoard from "./components/adminDashboard/adminDashBoard";
import Registration from "./components/sellerRegister/Registration";
import LoginForm from "./components/login/Login";

function App() {
    const [user, setUser] = useState({name: "", email: "", token: "", id: "", role: ""});
    const [error, setError] = useState("");
    const [logorcreate, setLogorCreate] = useState(false);

    const Login = (data) => {
        setUser({
            name: data.employee.name,
            email: data.employee.email,
            token: data.token,
            id: data.employee.id,
            role: data.employee.role,
            profileImage: data.employee.profileImage
        });
    };


    return (
        <LoginForm/>
    );
}

export default App;
