import React from "react";
import { Card, Button, Text, ButtonGroup, ActionList, Popover, InlineStack } from "@shopify/polaris";
import { BasePage } from "./BasePage";
import { FolderIcon, ChartHistogramSecondLastIcon } from '@shopify/polaris-icons';
import { Outlet } from "react-router-dom";
import { useParams } from "react-router";
import { ChevronDownIcon } from '@shopify/polaris-icons';
import { GQAccounts } from "../graphql/GQAccounts";
import { FormatCAD } from "../helpers/Formatter";
import { UploadThing } from "./UploadThing";

export const Home: React.FC = () => {

    const sections = [
        ["Reports", FolderIcon, "/reports"],
        ["Budgets", ChartHistogramSecondLastIcon, "/budgets"],
        ["Summary", ChartHistogramSecondLastIcon, "/summary"],
        ["Import Rules", ChartHistogramSecondLastIcon, "/rules"],
        ["Schedule", ChartHistogramSecondLastIcon, "/schedule"],
        ["Notes", ChartHistogramSecondLastIcon, "/notes"],
    ];

    const params = useParams();
    const accountId = params.account;
    const [active, setActive] = React.useState<string | null>(null);

    const { accountsData } = GQAccounts();

    const toggleActive = (id: string) => () => {
        setActive((activeId) => (activeId !== id ? id : null));
    };

    const actionListItems = accountsData?.accounts.map((account) => {
        return {
            content: account.accountName,
            url: `/accounts/${account.id}`
        };
    }
    );
    if (actionListItems) {
        actionListItems.push({ content: "All", url: "/accounts/0" });
    }

    const onUploadComplete = (accountId: number | null) => {
        // Clear the GraphQL cache

    };

    const buttons = (
        <ButtonGroup>
            <ButtonGroup variant="segmented">
                <Button url="/accounts" icon={FolderIcon}>Accounts</Button>
                <Popover
                    active={active === 'popover2'}
                    preferredAlignment="right"
                    activator={
                        <Button
                            onClick={toggleActive('popover2')}
                            icon={ChevronDownIcon}
                            accessibilityLabel="Account list"
                        />
                    }
                    autofocusTarget="first-node"
                    onClose={toggleActive('popover2')}
                >
                    <ActionList
                        actionRole="menuitem"
                        items={actionListItems}
                    />
                </Popover>
            </ButtonGroup>
            {
                sections.map((section) => {
                    const url: string = section[2] as string;
                    const text: string = section[0] as string;
                    return (
                        <Button size="large" icon={section[1]} url={url}>{text}</Button>);
                })
            }
            <UploadThing reload={onUploadComplete} />
        </ButtonGroup >
    );

    const currentThing = () => {
        if (accountId == "0") {
            return <><br /><Text as="h2" variant="headingSm">All Accounts</Text></>
        }
        if (accountId && accountsData) {
            const accountData = accountsData.accounts.find((a) => a.id === accountId);
            return <>
                <br />
                <InlineStack gap="200">
                    <Text as="h2" variant="headingSm">Account: {accountData.accountName}</Text>
                    {FormatCAD(accountData.balance)}
                </InlineStack>
            </>;
        }
        return null;
    }

    return (<>
        <BasePage title="Bankroll">
            <Card>
                {buttons}
                {currentThing()}
            </Card>
            <Outlet />
        </BasePage>
    </>);
};

export default Home;