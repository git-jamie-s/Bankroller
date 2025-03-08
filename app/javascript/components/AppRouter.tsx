import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './Home/Home';
import Summary from './Reports/Summary/Summary';
import Reports from "./Reports/Reports";
import Accounts from "./Accounts/Accounts";
import AccountPage from "./Accounts/Account/AccountPage";
import BudgetsPage from "./Budgets/BudgetsPage";
import ImportRulesPage from "./ImportRules/ImportRulesPage";


export default props => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />}>
                <Route path="accounts" element={<Accounts />}></Route>
                <Route path="accounts/:account" element={<AccountPage />} />
                <Route path="budgets" element={<BudgetsPage />} />
                <Route path="rules" element={<ImportRulesPage />} />
                {/*}
                <Route path="schedule" element={<ScheduledTransactionsPage />} />
                */}
                <Route path="reports" element={<Reports />}>
                    <Route path="summary" element={<Summary />} />
                </Route>
            </Route>

        </Routes>
    </Router>); 
