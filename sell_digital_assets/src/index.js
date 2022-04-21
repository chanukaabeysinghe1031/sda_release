import {render} from "react-dom";
import {BrowserRouter,Routes, Route,} from "react-router-dom";
import App from "./App";
import AdminDashBoard from "./components/adminDashboard/adminDashBoard";
import SellerHomePage from "./components/sellerHomePage/SellerHomePage";
import LoginForm from "./components/login/Login";
import Registration from "./components/sellerRegister/Registration";
import VerificationEmail from "./components/sellerRegister/VerificationEmail";
import AdminTransactions from "./components/adminTransactions/adminTransactions";
import AdminAddCoins from "./components/adminAddCoins/adminAddCoins";
import AdminSellers from "./components/adminSellers/adminSellers";
import SellerTransConfirmation from "./components/seller_trans_confirmation/seller_trans_confirmation";
import AdminBuyCoins from "./components/adminBuyCoins/adminBuyCoins";
import AdminTransactionDetails from "./components/adminTransactionDetails/adminTransactionDetails";
import SellerOldTransactions from "./components/sellerOldTransactions/sellerOldTransactions";
import SellerProfilePage from "./components/sellerProfilePage/sellerProfilePage";
import AdminSettings from "./components/adminSettings/adminSettings";

const rootElement = document.getElementById("root");
render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/adminDashboard" element={<AdminDashBoard />} />
            <Route path="/sellerHomePage" element={<SellerHomePage />} />
            <Route path="/sellerLogin" element={<LoginForm/>} />
            <Route path="/sellerRegistration" element={<Registration/>} />
            <Route path="/adminTransactions" element={<AdminTransactions/>} />
            <Route path="/adminAddCoins" element={<AdminAddCoins/>} />
            <Route path="/adminSellers" element={<AdminSellers/>} />
            <Route path="/verificationEmail" element={<VerificationEmail/>} />
            <Route path="/sellingConfirmation" element={<SellerTransConfirmation/>} />
            <Route path="/adminBuyCoin" element={<AdminBuyCoins/>} />
            <Route path="/transactionDetails" element={<AdminTransactionDetails/>} />
            <Route path="/sellerProfilePage" element={<SellerProfilePage/>} />
            <Route path="/sellerOldTransactions" element={<SellerOldTransactions/>} />
            <Route path="/adminSettings" element={<AdminSettings/>} />
        </Routes>
    </BrowserRouter>,
    rootElement
);