import React from "react";
import { Card } from "@shopify/polaris";
import { useParams } from "react-router";
import { Transactions } from "./Transactions";
import { GQAccount } from "../../../graphql/GQAccount";

export const AccountPage: React.FC = () => {
    let params = useParams();
    const accountId = params.account
    console.log("Account ID", accountId);

    const { accountData, loading, error } = GQAccount(accountId);

    if (loading) return null;
    if (error) return <p>Error : {error.message}</p>;

    const account = accountData.account;

    return (<>
        <Card>
            <Transactions account={account} />
        </Card>
    </>);
};

export default AccountPage;