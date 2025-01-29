import React, { } from "react";
import { Text, IndexTable, Button } from "@shopify/polaris";
import { FormatCAD } from "../../../helpers/Formatter";
import { TransactionType } from "../../../graphql/Types";
import { TransactionDescription } from "./TransactionDescription";
import { TransactionCategory } from "./TransactionCategory";
import { StateOption } from "../../../helpers/useFilterState";

interface Props {
    index: number;
    transaction: TransactionType;
    includeAccount: boolean;
    includeBalance: boolean;
    editingDescription: StateOption<TransactionType | null>;
    editingCategory: StateOption<TransactionType | null>;
};

export const TransactionRow: React.FC<Props> = ({ index, transaction, includeAccount, includeBalance, editingDescription, editingCategory }) => {
    const amount = FormatCAD(transaction.amount);
    const balance = FormatCAD(transaction.balance);
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
        <IndexTable.Row id={transaction.id} key={transaction.id} position={index}>
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
    )

};