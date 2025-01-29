import React from "react";
import { Card, Button, Text, ButtonGroup, ActionList, Popover, InlineStack } from "@shopify/polaris";
import { BasePage } from "./BasePage";
import { FolderIcon, ChartHistogramSecondLastIcon, NoteIcon, CalendarIcon, WalletIcon, CodeAddIcon } from '@shopify/polaris-icons';
import { Outlet } from "react-router-dom";
import { useParams } from "react-router";
import { useLocation } from 'react-router-dom'
import { ChevronDownIcon } from '@shopify/polaris-icons';
import { GQAccounts } from "../graphql/GQAccounts";
import { FormatCAD } from "../helpers/Formatter";
import { UploadThing } from "./UploadThing";
import { useApolloClient } from '@apollo/client';

export const Home: React.FC = () => {

    const sections = [
        ["Reports", FolderIcon, "/reports"],
        ["Budgets", ChartHistogramSecondLastIcon, "/budgets"],
        ["Summary", WalletIcon, "/summary"],
        ["Import Rules", CodeAddIcon, "/rules"],
        ["Schedule", CalendarIcon, "/schedule"],
        ["Notes", NoteIcon, "/notes"],
    ];

    const location = useLocation();
    const params = useParams();
    const accountId = params.account;
    const [active, setActive] = React.useState<string | null>(null);
    const apolloClient = useApolloClient();

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
        console.log("Clearing the cache of account data...");
        apolloClient.resetStore();
    };

    const isAccountsPage = location.pathname.includes("accounts");

    const buttons = (
        <ButtonGroup>
            <ButtonGroup variant="segmented">
                <Button size="large"
                    url="/accounts"
                    icon={FolderIcon}
                    variant={isAccountsPage ? "primary" : "secondary"}>
                    Accounts
                </Button>
                <Popover
                    active={active === 'popover2'}
                    preferredAlignment="right"
                    activator={
                        <Button
                            size="large"
                            onClick={toggleActive('popover2')}
                            icon={ChevronDownIcon}
                            accessibilityLabel="Account list"
                            variant={isAccountsPage ? "primary" : "secondary"}
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
                    const variant = location.pathname.includes(url) ? "primary" : "secondary";
                    return (
                        <Button size="large" icon={section[1]} url={url} variant={variant}>{text}</Button>);
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