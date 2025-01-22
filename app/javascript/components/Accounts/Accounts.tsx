import React, { useState } from "react";
import { Card, Text, Spinner, ResourceList, ResourceItem, InlineStack, Icon, Button, TextField, Toast, Frame } from "@shopify/polaris";
import { BookOpenIcon } from "@shopify/polaris-icons";
import { GQAccounts } from "../../graphql/GQAccounts";
import { AccountType } from "../../graphql/Types";
import { GMUpdateAccountName } from "../../graphql/GMAccountName";

export const Accounts: React.FC = () => {
    const { loading, error, accountsData } = GQAccounts();
    const CAD = new Intl.NumberFormat('en-CA', { style: "currency", currency: "CAD" });

    const [editingAccount, setEditingAccount] = useState<AccountType | null>(null);
    const [updateAccountName, { }] = GMUpdateAccountName();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    if (loading) return <Spinner />;
    if (error) return <p>Error : {error.message}</p>;

    function editAccount(account) {
        setEditingAccount(account);
    }

    function saveAccount() {
        setToastMessage(null);
        if (editingAccount) {
            updateAccountName({ variables: { accountId: editingAccount?.id, accountName: editingAccount.accountName } })
                .then(() => {
                    setToastMessage("Account name saved");
                })
                .catch((e) => { setToastMessage(e.message) });
        }

        setEditingAccount(null);
    }

    function renderItem(account) {
        const media = <Icon source={BookOpenIcon} />;
        const isAllThat = account.id === "0";

        const balance = isAllThat ? undefined : CAD.format(account.balance / 100);

        if (editingAccount && account.id === editingAccount.id) {
            return (<ResourceItem
                key={account.id}
                id={account.id}
                media={media}
                onClick={() => { }}
                accessibilityLabel="Edit name of account">
                <TextField
                    label="Account Name"
                    autoComplete="off"
                    value={editingAccount?.accountName}
                    onChange={(v) => { setEditingAccount({ ...editingAccount, accountName: v }) }}
                    onBlur={() => saveAccount()} />
            </ResourceItem>);
        }

        const shortcutActions = isAllThat || editingAccount !== null ? undefined : [{ content: 'Edit', onAction: () => editAccount(account) }];
        return (
            <ResourceItem
                key={account.id}
                shortcutActions={shortcutActions}
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

    const toastMarkup = toastMessage ? (
        <Toast content={toastMessage} onDismiss={() => { setToastMessage(null) }} duration={2000} />
    ) : null;

    return (<Frame>
        {toastMarkup}
        <Card>
            <ResourceList
                items={accounts}
                renderItem={renderItem}
            />
        </Card>
    </Frame>);
};

export default Accounts;