import React from "react";
import { Card, Button, Icon, ButtonGroup } from "@shopify/polaris";
import Accounts from "./Accounts/Accounts";
import { BasePage } from "./BasePage";
import { FolderIcon } from '@shopify/polaris-icons';
import { Outlet } from "react-router-dom";

export const Home: React.FC = () => {

    const buttons = (
        <ButtonGroup>
            <Button icon={FolderIcon} url="/accounts">Accounts</Button>
            <Button url="/budgets">Budgets</Button>
        </ButtonGroup>
    );

    return (<>
        <BasePage title="Bankroll">
            <Card>{buttons}</Card>
            <Outlet />
        </BasePage>
    </>);
};

export default Home;