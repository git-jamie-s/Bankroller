import React from "react";
import { GQAccounts } from "../../graphql/GQAccounts";
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { Dropdown, MenuButton } from "@mui/joy";

interface Props {
    isAccountsPage: boolean;
}
const AccountsButton: React.FC<Props> = ({ isAccountsPage }) => {
    const { accountsData } = GQAccounts();

    const options = accountsData?.accounts.map((account) => {
        return {
            content: account.accountName,
            url: `/accounts/${account.id}`
        };
    }
    ) || [];

    options.push({ content: "All", url: "/accounts/0" });

    const items = options.map((option, index) => {
        return <MenuItem key={index} component="a" href={option.url}>{option.content}</MenuItem>
    });

    return (
        <Dropdown>
            <MenuButton
                color="primary"
                variant="solid"
                startDecorator={<AccountBalanceIcon />}
                endDecorator={<ArrowDropDownIcon />}
            >
                Accounts
            </MenuButton>
            <Menu>
                {items}
            </Menu>
        </Dropdown>
    );
}

export default AccountsButton;