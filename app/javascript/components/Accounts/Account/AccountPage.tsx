import React from "react";
import { useParams } from "react-router";
import { Transactions } from "./Transactions";
import { GQAccount } from "../../../graphql/GQAccount";
import { Card, Typography } from "@mui/joy";
import AccountTitle from "./AccountTitle";

export const AccountPage: React.FC = () => {
    let params = useParams();
    const accountId = params.account

    const { accountData, loading, error } = GQAccount(accountId);

    if (loading) return null;
    if (error) return <p>Error : {error.message}</p>;

    const account = accountData.account;

    const allAccounts = (accountId === "0") && <Typography level="title-lg">All Accounts</Typography>;
    const accountTitle = account !== null && accountId !== "0" &&
        <AccountTitle account={account} />;

    return (<>
        <Card>
            {allAccounts}
            {accountTitle}
            <Transactions account={account} />
        </Card>
    </>);
};

export default AccountPage;