import React, { useState } from "react";
import { GQAccounts } from "../../graphql/GQAccounts";
import { AccountType } from "../../graphql/Types";
import { GMUpdateAccountName } from "../../graphql/GMAccountName";
import { Card, CircularProgress, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Snackbar, Typography } from "@mui/joy";
import TableViewIcon from '@mui/icons-material/TableView';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { FormatCAD } from "../../helpers/Formatter";

export const Accounts: React.FC = () => {
    const { loading, error, accountsData } = GQAccounts();
    const CAD = new Intl.NumberFormat('en-CA', { style: "currency", currency: "CAD" });

    const [editingAccount, setEditingAccount] = useState<AccountType | null>(null);
    const [updateAccountName, { }] = GMUpdateAccountName();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    if (loading) return <CircularProgress />;
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

    const accounts = accountsData.accounts.map(item => ({ ...item }));
    accounts.push({ id: "0", accountName: "all", balance: "" });

    const accountItems = accounts.map((account) => {
        const href = "/accounts/" + account.id;
        return <ListItem>
            <ListItemButton component="a" href={href}>
                <ListItemDecorator><TableViewIcon /></ListItemDecorator>
                <ListItemContent>
                    <Typography level="title-sm">{account.accountName}</Typography>
                    <Typography level="body-sm" noWrap>
                        {FormatCAD(account.balance)}
                    </Typography>
                </ListItemContent>

                <KeyboardArrowRightIcon />
            </ListItemButton>
        </ListItem>;
    });

    const toastMarkup = toastMessage ? (
        <Snackbar open={true} >
            toastMessage
        </Snackbar>
    ) : null;

    return (
        <>
            {toastMarkup}
            <Card>
                <List>
                    {accountItems}
                </List>
            </Card>
        </>
    );
};

export default Accounts;