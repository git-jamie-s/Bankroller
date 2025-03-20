import React from "react";
import { BasePage } from "../BasePage";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

import { useParams } from "react-router";
import { useApolloClient } from '@apollo/client';

export const Home: React.FC = () => {
    const params = useParams();
    const apolloClient = useApolloClient();

    const onUploadComplete = () => {
        apolloClient.resetStore();
    };

    return (<>
        <BasePage title="Bankroll">
            <NavBar reload={onUploadComplete} />
            <Outlet />
        </BasePage>
    </>);
};

export default Home;