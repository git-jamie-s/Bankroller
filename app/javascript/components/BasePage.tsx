import React from "react";
import { AppProvider, Page } from "@shopify/polaris";

type Props = {
    title: string;
    children: React.ReactNode
};

export const BasePage: React.FC<Props> = ({ title, children }) => {
    return (
        <AppProvider
            i18n={{
                Polaris: {
                    ResourceList: {
                        sortingLabel: 'Sort by',
                        defaultItemSingular: 'item',
                        defaultItemPlural: 'items',
                        showing: 'Showing {itemsCount} {resource}',
                        Item: {
                            viewItem: 'View details for {itemName}',
                        },
                    },
                    Common: {
                        checkbox: 'checkbox',
                    },
                },
            }}
        >
            <Page title={title} fullWidth>
                {children}
            </Page>
        </AppProvider>
    );
};