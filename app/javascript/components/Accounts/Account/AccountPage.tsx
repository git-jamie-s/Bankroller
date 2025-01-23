import React from "react";
import { Card } from "@shopify/polaris";
import { useParams } from "react-router";
import { Transactions } from "./Transactions";
import { GQAccount } from "../../../graphql/GQAccount";

export const AccountPage: React.FC = () => {
    let params = useParams();
    const accountId = params.account
    const { accountData, loading, error } = GQAccount(accountId);

    if (loading) return null;
    if (error) return <p>Error : {error.message}</p>;

    return (<>
        <Card>
            <Transactions account={accountData.account} />
        </Card>
    </>);
};

export default AccountPage;