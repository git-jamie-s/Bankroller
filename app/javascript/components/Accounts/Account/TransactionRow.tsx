import React from "react";
import { Text, IndexTable, Button, Popover, ActionList } from "@shopify/polaris";
import { FormatCAD } from "../../../helpers/Formatter";
import { TransactionType } from "../../../graphql/Types";
import { TransactionDescription } from "./TransactionDescription";
import { TransactionCategory } from "./TransactionCategory";
import { StateOption } from "../../../helpers/useFilterState";
import { ChevronDownIcon } from "@shopify/polaris-icons";

interface Props {
    index: number;
    transaction: TransactionType;
    includeAccount: boolean;
    includeBalance: boolean;
    editingDescription: StateOption<TransactionType | null>;
    editingCategory: StateOption<TransactionType | null>;
    onCreateRule: (transaction) => void;

};

export const TransactionRow: React.FC<Props> = ({ index, transaction, includeAccount, includeBalance, editingDescription, editingCategory, onCreateRule }) => {
    const amount = FormatCAD(transaction.amount);
    const balance = FormatCAD(transaction.balance);
    const [active, setActive] = React.useState<string | null>(null);

    const popId = `popover-${index}`;
    const actionItems = [
        {
            content: "Create Rule",
            onAction: () => {
                setActive(null);
                onCreateRule(transaction);
            }
        },
        {
            content: "Schedule",
            onAction: () => { }
        }
    ];

    const toggleMenuActive = (id: string) => () => {
        setActive((activeId) => (activeId !== id ? id : null));
    };

    const menu = transaction.categoryId && (
        <Popover
            active={popId === active}
            preferredAlignment="right"
            activator={
                <Button
                    fullWidth={false}
                    size="slim"
                    onClick={toggleMenuActive(popId)}
                    icon={ChevronDownIcon}
                    accessibilityLabel="Account list"
                />
            }
            autofocusTarget="first-node"
            onClose={toggleMenuActive(popId)}
        >
            <ActionList
                actionRole="menuitem"
                items={actionItems}
            />
        </Popover>
    );


    const accountCell = includeAccount && (
        <IndexTable.Cell>{transaction.account.accountName}</IndexTable.Cell>
    );
    const balanceCell = includeBalance && (
        <IndexTable.Cell>
            <Text as="span" alignment="end" numeric>
                {balance}
            </Text>
        </IndexTable.Cell>
    );



    return (
        <>
            <IndexTable.Row id={transaction.id} key={transaction.id} position={index}>
                <IndexTable.Cell>{menu}</IndexTable.Cell>
                {accountCell}
                <IndexTable.Cell>{transaction.date.toString()}</IndexTable.Cell>
                <IndexTable.Cell>{transaction.transactionType}</IndexTable.Cell>
                <IndexTable.Cell>
                    <TransactionDescription transaction={transaction} editing={editingDescription} />
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <TransactionCategory index={index} transaction={transaction} editing={editingCategory} />
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="end" numeric>
                        {amount}
                    </Text>
                </IndexTable.Cell>
                {balanceCell}
            </IndexTable.Row>
        </>
    )

};