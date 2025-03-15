import React from "react";
import { BasePage } from "../BasePage";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

import { useParams } from "react-router";
import { useLocation } from 'react-router-dom'
import { GQAccounts } from "../../graphql/GQAccounts";
import { useApolloClient } from '@apollo/client';

export const Home: React.FC = () => {

    // const sections = [
    //     ["Budgets", ChartHistogramSecondLastIcon, "/budgets"],
    //     ["Import Rules", CodeAddIcon, "/rules"],
    //     ["Schedule", CalendarIcon, "/schedule"],
    // ];

    const location = useLocation();
    const params = useParams();
    const accountId = params.account;
    const apolloClient = useApolloClient();

    const { accountsData } = GQAccounts();

    const onUploadComplete = () => {
        apolloClient.resetStore();
    };

    const isAccountsPage = location.pathname.includes("accounts");
    const isReportsPage = location.pathname.includes("reports");

    // const buttons = (
    //     <ButtonGroup>
    //         <AccountsButton isAccountsPage={isAccountsPage} />
    //         <ReportsButton isReportsPage={isReportsPage} />
    //         {
    //             sections.map((section) => {
    //                 const url: string = section[2] as string;
    //                 const text: string = section[0] as string;
    //                 const variant = location.pathname.includes(url) ? "primary" : "secondary";
    //                 return (
    //                     <Button size="large" icon={section[1]} url={url} variant={variant}>{text}</Button>);
    //             })
    //         }
    //         <UploadThing reload={onUploadComplete} />
    //     </ButtonGroup >
    // );

    // const currentThing = () => {
    //     if (accountId == "0") {
    //         return <Text as="h2" variant="headingSm">All Accounts</Text>
    //     }
    //     if (accountId && accountsData) {
    //         const accountData = accountsData.accounts.find((a) => a.id === accountId);
    //         return <>
    //             <br />
    //             <InlineStack gap="200">
    //                 <Text as="h2" variant="headingSm">Account: {accountData.accountName}</Text>
    //                 {FormatCAD(accountData.balance)}
    //             </InlineStack>
    //         </>;
    //     }
    //     if (isReportsPage) {
    //         return <Text as="h2" variant="headingSm">Reports</Text>;
    //     }
    //     return <Text as="h2" variant="headingSm">Bankroll</Text>;
    // }

    return (<>
        <BasePage title="Bankroll">
            <NavBar reload={onUploadComplete} />
            <Outlet />
        </BasePage>
    </>);
};

export default Home;