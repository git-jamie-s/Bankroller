import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './Home';
import Accounts from './Accounts/Accounts';
import AccountPage from './Accounts/Account/AccountPage';

import Budgets from "./Budgets/Budgets";

export default props => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />}>
                <Route path="accounts" element={<Accounts />}>
                </Route>
                <Route path="accounts/:account" element={<AccountPage />} />
                <Route path="budgets" element={<Budgets />} />
            </Route>
        </Routes>
    </Router>);
