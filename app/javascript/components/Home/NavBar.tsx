import { Button, Stack } from "@mui/joy";
import React from "react";
import { Paid, AutoFixHigh, Schedule } from '@mui/icons-material';
import AccountsButton from "./AccountsButton";
import ReportsButton from "./ReportsButton";
import { UploadThing } from "../UploadThing";
import { useLocation } from 'react-router-dom'

interface Props {
    reload: () => void;
};

const NavBar: React.FC<Props> = ({ reload }) => {
    const location = useLocation();

    const isAccountsPage = location.pathname.includes("accounts");
    const isReportsPage = location.pathname.includes("reports");
    const isRulesPage = location.pathname.includes("rules");


    function button(path, decorator, title) {
        const color = location.pathname.includes(path) ? "success" : "primary";
        return <Button
            startDecorator={decorator}
            component="a"
            href={path}
            color={color}
        >
            {title}
        </Button>
    }

    return (
        <Stack direction="row" spacing="4px" className="navbarber">
            <AccountsButton isAccountsPage={isAccountsPage} />
            <ReportsButton isReportsPage={isReportsPage} />
            {button("/budgets", <Paid />, "Budgets")}
            {button("/rules", <AutoFixHigh />, "Import Rules")}
            {button("/schedule", <Schedule />, "Scheduled Txns")}
            <UploadThing reload={reload} />
        </Stack>);
};

export default NavBar;