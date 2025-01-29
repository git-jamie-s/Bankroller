import React from "react";
import { Card, Button, Icon, DataTable, Spinner } from "@shopify/polaris";
import { CircleChevronDownIcon } from "@shopify/polaris-icons";
import { useQuery, gql } from '@apollo/client';

export const Budgets: React.FC = () => {
    const GET_ACCOUNTS = gql`
        query GetAccounts { 
            accounts {
                id
                accountName
                created
            }
        }`;

    const { loading, error, data } = useQuery(GET_ACCOUNTS);

    if (loading) return <Spinner />;
    if (error) return <p>Error : {error.message}</p>;

    const rows = data.accounts.map((account) => {
        return [account.accountName, account.createdAt];
    });

    return (<>
        <Card>
            Budgets!
        </Card>
    </>);
};

export default Budgets;