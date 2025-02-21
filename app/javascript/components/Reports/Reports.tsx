import React, { useState } from "react";
import { Card, Text, Spinner, ResourceList, ResourceItem, InlineStack, Icon, Button, TextField, Toast, Frame } from "@shopify/polaris";
import { BookOpenIcon } from "@shopify/polaris-icons";
import { GQAccounts } from "../../graphql/GQAccounts";
import { AccountType } from "../../graphql/Types";
import { GMUpdateAccountName } from "../../graphql/GMAccountName";
import { Outlet } from "react-router-dom";

export const Reports: React.FC = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

export default Reports;