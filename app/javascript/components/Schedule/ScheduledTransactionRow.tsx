import React, { useState } from "react";
import { FormatAmountString, FormatCAD } from "../../helpers/Formatter";
import { StateOption } from "../../helpers/useFilterState";
import { ScheduledTransactionType } from "../../graphql/Types";
import { GMDeleteScheduledTransaction } from "../../graphql/GMDeleteScheduledTransaction";
import { Delete } from "@mui/icons-material";
import { Button, IconButton, Input } from "@mui/joy";

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
                variant="plain"
                fullWidth
                onClick={() => {
                    editingMaxAmount.setter(null);
                    editingMinAmount.setter(scheduledTransaction);
                    setMinAmount(FormatAmountString(scheduledTransaction.minAmount));
                }}>
                {minAmountStr}
            </Button>;
        }
        return <Input
            size="sm"
            placeholder="Amount"
            type="currency"
            autoFocus
            onChange={(event) => {
                console.log("Setting min amount: ", event.target.value); setMinAmount(filter(event.target.value))
            }}
            value={minAmount}
            onBlur={() => {
                editingMinAmount.setter({ ...scheduledTransaction, minAmount: Number(minAmount) * 100 });
            }}
        />;
    }

    const startDate = scheduledTransaction.startDate.toString();

    return (
        <tr key={scheduledTransaction.id}>
            <td>
                <IconButton onClick={() => onDelete(scheduledTransaction)} ><Delete /></IconButton>
            </td>
            <td>{scheduledTransaction.description}</td>
            <td>{scheduledTransaction.transactionType}</td>
            <td>{minAmountCell()}</td>
            <td>{accountName}</td>
            <td>{scheduledTransaction.period}</td>
            <td>{scheduledTransaction.weekendAdjust}</td>
            <td>{startDate}</td>
        </tr>
    );
};