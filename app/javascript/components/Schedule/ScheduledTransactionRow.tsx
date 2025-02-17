import React, { useState } from "react";
import { Button, IndexTable, TextField } from "@shopify/polaris";
import { DeleteIcon } from '@shopify/polaris-icons';
import { FormatAmountString, FormatCAD } from "../../helpers/Formatter";
import { StateOption } from "../../helpers/useFilterState";
import { ScheduledTransactionType } from "../../graphql/Types";
import { GMDeleteScheduledTransaction } from "../../graphql/GMDeleteScheduledTransaction";

interface Props {
    index: number;
    scheduledTransaction: ScheduledTransactionType;
    editingMinAmount: StateOption<ScheduledTransactionType | null>;
    editingMaxAmount: StateOption<ScheduledTransactionType | null>;
    setToastMessage: (string) => void;
};

export const ScheduledTransactionRow: React.FC<Props> = ({ index, scheduledTransaction, setToastMessage, editingMinAmount, editingMaxAmount }) => {

    const [deleteScheduledTransaction, { data: deleteData, error: deleteError }] = GMDeleteScheduledTransaction();

    const [minAmount, setMinAmount] = useState<string>("");

    const onDelete = (scheduledTransaction) => {
        deleteScheduledTransaction({ variables: { id: scheduledTransaction.id } })
            .then(() => { setToastMessage("Scheduled Transaction deleted") })
            .catch((e) => { setToastMessage(e.message); });
    };


    const accountName = scheduledTransaction.account.accountName;
    const max_amount = scheduledTransaction.maxAmount ? FormatCAD(scheduledTransaction.maxAmount) : "-";

    function filter(amount) {
        var re = /[-]?\d*\.?\d{0,2}/;
        const filtered = (amount.match(re) || []).join('');
        return (filtered);
    };

    const minAmountCell = () => {
        const minAmountStr = FormatAmountString(scheduledTransaction.minAmount);
        if (editingMinAmount?.current !== scheduledTransaction) {
            return <Button
                fullWidth
                textAlign="start"
                variant="tertiary"
                onClick={() => {
                    editingMaxAmount.setter(null);
                    editingMinAmount.setter(scheduledTransaction);
                    setMinAmount(FormatAmountString(scheduledTransaction.minAmount));
                }}>
                {minAmountStr}
            </Button>;
        }
        return <TextField
            size="slim"
            label="Amount"
            type="currency"
            autoComplete="off"
            autoFocus
            onChange={(value) => { setMinAmount(filter(value)) }}
            value={minAmount}
            onBlur={() => {
                editingMinAmount.setter({ ...scheduledTransaction, minAmount: Number(minAmount) * 100 });
            }}
        />;
    }

    const startDate = scheduledTransaction.startDate.toString();

    return (
        <IndexTable.Row
            id={scheduledTransaction.id}
            key={scheduledTransaction.id}
            position={index}>
            <IndexTable.Cell>
                <Button icon={DeleteIcon} onClick={() => onDelete(scheduledTransaction)} />
            </IndexTable.Cell>
            <IndexTable.Cell>{scheduledTransaction.description}</IndexTable.Cell>
            <IndexTable.Cell>{scheduledTransaction.transactionType}</IndexTable.Cell>
            <IndexTable.Cell>{minAmountCell()}</IndexTable.Cell>
            <IndexTable.Cell>{max_amount}</IndexTable.Cell>
            <IndexTable.Cell>{accountName}</IndexTable.Cell>
            <IndexTable.Cell>{scheduledTransaction.period}</IndexTable.Cell>
            <IndexTable.Cell>{scheduledTransaction.weekendAdjust}</IndexTable.Cell>
            <IndexTable.Cell>{startDate}</IndexTable.Cell>
        </IndexTable.Row>
    );
};