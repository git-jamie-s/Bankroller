import { ActionList, Button, ButtonGroup, Popover } from "@shopify/polaris";
import { GQAccounts } from "../graphql/GQAccounts";
import React from "react";
import { FolderIcon, ChevronDownIcon } from "@shopify/polaris-icons";

interface Props {
    isAccountsPage: boolean;
}
const AccountsButton: React.FC<Props> = ({ isAccountsPage }) => {
    const { accountsData } = GQAccounts();

    const [active, setActive] = React.useState<string | null>(null);

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


    return (
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
    );
}

export default AccountsButton;