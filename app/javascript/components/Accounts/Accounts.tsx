import React from "react";
import { Card, Button, Icon, DataTable, Spinner } from "@shopify/polaris";
import { CircleChevronDownIcon } from "@shopify/polaris-icons";
import { useQuery, gql } from '@apollo/client';

export const Accounts: React.FC = () => {
    const GET_ACCOUNTS = gql`
        query GetAccounts {
            accounts {
                id
                accountName
                createdAt
            }
        }`;

    const { loading, error, data } = useQuery(GET_ACCOUNTS);

    if (loading) return <Spinner/>;
    if (error) return <p>Error : {error.message}</p>;

    const rows = data.accounts.map( (account) => {
        return [account.accountName, account.createdAt];
    });

    return(<>
        <Card>
            <DataTable 
                columnContentTypes={["text", "numeric"]} 
                headings={["Account name", "Created"]} 
                rows={rows}>
            </DataTable>
        </Card>
    </>);
};

export default Accounts;