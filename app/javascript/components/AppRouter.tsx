import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './Home';
import Accounts from './Accounts/Accounts';
import AccountPage from './Accounts/Account/AccountPage';

import Budgets from "./Budgets/Budgets";
import AutoTransactionsPage from "./AutoTransactions/AutoTransactionsPage";
import ScheduledTransactionsPage from "./Schedule/ScheduledTransactionsPage";

export default props => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />}>
                <Route path="accounts" element={<Accounts />}>
                </Route>
                <Route path="accounts/:account" element={<AccountPage />} />
                <Route path="rules" element={<AutoTransactionsPage />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="schedule" element={<ScheduledTransactionsPage />} />
            </Route>
        </Routes>
    </Router>); 
