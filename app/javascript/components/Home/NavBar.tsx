import { Button, ButtonGroup, IconButton, Stack, Typography } from "@mui/joy";
import React from "react";
import { Percent, ArrowDropDown, Paid, AutoFixHigh } from '@mui/icons-material';
import AccountsButton from "./AccountsButton";
import ReportsButton from "./ReportsButton";

const NavBar: React.FC = () => {
    const brand = (
        <Typography color="success" variant="solid">Bankroll</Typography>
    )

    return (
        <Stack direction="row" spacing="4px">
            {brand}
            <AccountsButton isAccountsPage={false} />
            <ReportsButton isReportsPage={false} />
            <Button startDecorator={<Paid />} component="a" href="/budgets">Budgets</Button>
            <Button startDecorator={<AutoFixHigh />} component="a" href="/rules">Import Rules</Button>
        </Stack>);
};

export default NavBar;