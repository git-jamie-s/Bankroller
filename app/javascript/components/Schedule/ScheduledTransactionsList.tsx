import React, { useState } from "react";
import { Button, Frame, IndexTable, SkeletonPage, Toast, useIndexResourceState } from "@shopify/polaris";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import { FormatCAD } from "../../helpers/Formatter";
import { StateOption, useFilterState } from "../../helpers/useFilterState";
import { GMDeleteAutoTransaction } from "../../graphql/GMDeleteAutoTransaction";

interface Props {
    loading?: boolean;
    sorting: StateOption<string>;
    scheduledTransactionArray: any[];
}

export const ScheduledTransactionsList: React.FC<Props> = ({ loading, sorting, scheduledTransactionArray }) => {
    const desc = sorting.current.includes(" desc");
    const array = scheduledTransactionArray;

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    // const editingAutoTransaction = useFilterState<AutoTransactionType | null>(null);

    const handleSortClick = (sortVal) => {
        const sameCol = sorting.current.startsWith(sortVal);

        const newDesc = sameCol == desc ? "asc" : "desc";
        const newSortVal = `${sortVal} ${newDesc}, id ${newDesc}`;
        sorting.setter(newSortVal);
    }

    const dirIcon = desc ? ArrowDownIcon : ArrowUpIcon;
    function titleButton(label: string, sortVal: string) {
        const icon = (sorting.current.startsWith(sortVal)) ? dirIcon : undefined;
        return <Button variant="tertiary"
            fullWidth
            textAlign="left"
            icon={icon}
            onClick={() => handleSortClick(sortVal)}>{label}
        </Button>;
    }

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: "buttons", title: "" },
        { id: 'description', title: titleButton("Description", "description") },
        { id: 'type', title: titleButton("Transaction Type", "transaction_type") },
        { id: 'min_amount', title: titleButton("Min amount", "min_amount") },
        { id: 'max_amount', title: titleButton("Max amount", "max_amount") },
        { id: 'account', title: titleButton("Account", "account.account_name") },
    ];

    // const onDelete = (id) => {
    //     deleteAutoTransaction({ variables: { id: id } })
    //         .then(() => { setToastMessage("Rule deleted") })
    //         .catch((e) => { setToastMessage(e.message); });
    // };
    // const onEdit = (autoTransaction) => {
    //     editingAutoTransaction.setter(autoTransaction);
    // };

    // const handleSave = (apply) => {
    //     const changed: AutoTransactionType = editingAutoTransaction.current!;

    //     const amount = changed.amount === 0 ? null : changed.amount;
    //     const input = {
    //         id: changed.id,
    //         description: changed.description,
    //         categoryId: changed.categoryId,
    //         amount: amount,
    //         transactionType: changed.transactionType,
    //         accountId: changed.account?.id || null
    //     };
    //     upsertAutoTransaction({ variables: { autoTransaction: input, apply: apply } })
    //         .then(() => {
    //             editingAutoTransaction.setter(null);
    //             setToastMessage("Saved");
    //         })
    //         .catch((e) => { setToastMessage(e.message) });
    // };

    const rowMarkup = array.map(
        (scheduledTransaction, index) => {

            const accountName = scheduledTransaction.account.accountName;
            const min_amount = FormatCAD(scheduledTransaction.minAmount);
            const max_amount = scheduledTransaction.maxAmount ?
                FormatCAD(scheduledTransaction.maxAmount) : "-";

            return (
                <IndexTable.Row
                    id={scheduledTransaction.id}
                    key={scheduledTransaction.id}
                    position={index}>
                    <IndexTable.Cell>
                        Hey
                        {/* <Button icon={DeleteIcon} onClick={() => onDelete(autoTransaction.id)} />
                        <Button icon={EditIcon} onClick={() => onEdit(autoTransaction)} /> */}
                    </IndexTable.Cell>
                    <IndexTable.Cell>{scheduledTransaction.description}</IndexTable.Cell>
                    <IndexTable.Cell>{scheduledTransaction.transactionType}</IndexTable.Cell>
                    <IndexTable.Cell>{min_amount}</IndexTable.Cell>
                    <IndexTable.Cell>{max_amount}</IndexTable.Cell>
                    <IndexTable.Cell>{accountName}</IndexTable.Cell>
                </IndexTable.Row>
            )
        }
    );

    const toastMarkup = toastMessage ? (
        <Toast content={toastMessage} onDismiss={() => { setToastMessage(null) }} duration={2000} />
    ) : null;

    if (loading) {
        return <SkeletonPage />;
    }

    return (
        <Frame>
            <IndexTable
                headings={headings}
                itemCount={array.length}
                selectable={false}
                hasZebraStriping
            >
                {rowMarkup}
            </IndexTable>
            {toastMarkup}
        </Frame>
    );
};

