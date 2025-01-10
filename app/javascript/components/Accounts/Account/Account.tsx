import React from "react";
import { Card, Button, Icon, DataTable, Spinner } from "@shopify/polaris";
import { CircleChevronDownIcon } from "@shopify/polaris-icons";
import { useQuery, gql } from '@apollo/client';
import { useParams } from "react-router";

export const Account: React.FC = () => {
    let params = useParams();

    return (<>
        <Card>
            Account: {params.account}
        </Card>
    </>);
};

export default Account;