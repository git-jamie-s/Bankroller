import React from "react";
import { Card, Button, Icon, ButtonGroup } from "@shopify/polaris";
import Accounts from "./Accounts/Accounts";
import { BasePage } from "./BasePage";
import { FolderIcon } from '@shopify/polaris-icons';

export const Home: React.FC = () => {

    const buttons = (
        <ButtonGroup>
            <Button icon={FolderIcon}>Accounts</Button>
            <Button>Budgets</Button>
        </ButtonGroup>
    );

    return(<>
        <BasePage title="Bankroll">
            <Card>{buttons}</Card>
            <Accounts/>
        </BasePage>
    </>);
};

export default Home;