import React from "react";
import { Card, Button, Text, ButtonGroup } from "@shopify/polaris";
import { BasePage } from "./BasePage";
import { FolderIcon, ChartHistogramSecondLastIcon } from '@shopify/polaris-icons';
import { Outlet } from "react-router-dom";
import { useParams } from "react-router";
import { GQAccount } from "../queries/GQAccount";

export const Home: React.FC = () => {

    const sections = [
        ["Accounts", FolderIcon, "/accounts"],
        ["Reports", FolderIcon, "/reports"],
        ["Budgets", ChartHistogramSecondLastIcon, "/budgets"],
        ["Summary", ChartHistogramSecondLastIcon, "/summary"],
        ["Import Rules", ChartHistogramSecondLastIcon, "/rules"],
        ["Schedule", ChartHistogramSecondLastIcon, "/schedule"],
        ["Notes", ChartHistogramSecondLastIcon, "/notes"],
    ];

    const params = useParams();
    const accountId = params.account;

    const { accountData } = accountId ? GQAccount(accountId) : { accountData: null };

    const buttons = (
        <ButtonGroup>
            {sections.map((section) => {
                const url: string = section[2] as string;
                const text: string = section[0] as string;
                return (
                    <Button icon={section[1]} url={url}>{text}</Button>);
            })}
        </ButtonGroup>
    );

    const currentThing = () => {
        if (accountData) {
            return <Text as="h2" variant="headingSm">Account: {accountData.account.accountName}</Text>
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