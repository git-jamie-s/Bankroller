import React from "react";
import { Card, Text, Spinner, ResourceList, ResourceItem, Avatar, Icon } from "@shopify/polaris";
import { BookOpenIcon } from "@shopify/polaris-icons";
import { GQAccounts } from "../../queries/GQAccounts";

export const Accounts: React.FC = () => {
    const { loading, error, accountsData } = GQAccounts();
    const CAD = new Intl.NumberFormat('en-CA', { style: "currency", currency: "CAD" });

    if (loading) return <Spinner />;
    if (error) return <p>Error : {error.message}</p>;

    function renderItem(account) {
        const media = <Icon source={BookOpenIcon} />;
        const balance = CAD.format(account.balance / 100);

        return (
            <ResourceItem
                key={account.id}
                id={account.id}
                url={"/accounts/" + account.id}
                media={media}
                accessibilityLabel={`View details for account ${account.name}`}
            >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {account.accountName}
                </Text>
                <>{balance}</>
            </ResourceItem>
        );
    }
    const accounts = accountsData.accounts.map(item => ({ ...item }));
    accounts.push({ id: "0", accountName: "all", balance: "" });

    return (<>
        <Card>
            <ResourceList
                items={accounts}
                renderItem={renderItem}
            />
        </Card>
    </>);
};

export default Accounts;