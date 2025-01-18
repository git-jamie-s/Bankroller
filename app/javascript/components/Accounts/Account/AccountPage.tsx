import React from "react";
import { Card, Spinner } from "@shopify/polaris";
import { useParams } from "react-router";
import { Transactions } from "./Transactions";
import { GQAccount } from "../../../graphql/GQAccount";

export const AccountPage: React.FC = () => {
    let params = useParams();
    const accountId = params.account
    const { accountData, loading, error } = GQAccount(accountId);

    if (loading) return <Spinner />;
    if (error) return <p>Error : {error.message}</p>;

    const account = error ? { id: 0 } : accountData.account;

    return (<>
        <Card>
            <Transactions account={account} />
        </Card>
    </>);
};

export default AccountPage;