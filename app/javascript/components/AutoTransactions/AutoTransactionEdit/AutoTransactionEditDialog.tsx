import React, { useState } from "react";
import { BlockStack, Card, Text, Modal, Select, TextField, Autocomplete, Button, InlineStack } from '@shopify/polaris';
import { GQTransactionTypes } from "../../../graphql/GQTransactionTypes";
import { GQCategories } from "../../../graphql/GQCategories";
import { AutoTransactionEditCategory } from "./AutoTransactionEditCategory";
import { useFilterState } from "../../../helpers/useFilterState";

interface Props {
    autoTransaction: any;
    onClose: () => void;
    onSave: () => void;
}

export const AutoTransactionEditDialog: React.FC<Props> = ({ autoTransaction, onSave, onClose }) => {

    // const autoTran = autoTransaction;
    const curAutoAmount = autoTransaction?.current.amount / 100.0;
    const curAutoAmountStr = curAutoAmount === 0 ? "" : curAutoAmount.toString();

    const [strAmount, setStrAmount] = useState<string>(curAutoAmountStr);

    const { transactionTypeData } = GQTransactionTypes();

    const ttOptions = transactionTypeData?.transactionTypes
        .filter((tt) => tt !== "LEDGER")
        .map((tt) => { return { label: tt, value: tt } }) || [];

    ttOptions.unshift({ label: "- None -", value: "" })

    function setValue(value) {
        const newAutoTran = { ...autoTransaction.current, ...value };
        console.log("Setting: ", newAutoTran);
        autoTransaction.setter(newAutoTran);
    }

    const onChangeDescription = (description) => { setValue({ description }) };
    const onSetTransactionType = (transactionType) => { setValue({ transactionType }) };
    const onChangeAmount = (amount) => {
        var re = /[-]?\d*\.?\d{0,2}/;
        const filtered = (amount.match(re) || []).join('');
        setStrAmount(filtered);
        setValue({ amount: Number(filtered) * 100 })
    };

    return <Modal open={true} title="Import Rule Editor" onClose={onClose}
    >
        <Card>
            <TextField
                label="Description (use * for wildcard matching)"
                value={autoTransaction.current.description}
                onChange={onChangeDescription}
                autoComplete="off"
            />
            <Select
                options={ttOptions}
                label="Transaction Type"
                value={autoTransaction.current.transactionType || ""}
                onChange={onSetTransactionType}
            />
            <AutoTransactionEditCategory autoTransaction={autoTransaction} />
            <TextField
                label="Amount"
                type="currency"
                autoComplete="off"
                onChange={onChangeAmount}
                value={strAmount}
            />
        </Card>
        <Card>
            <InlineStack align="center" gap="025">
                <Button variant="primary" onClick={onSave}>Save</Button>
                <Button onClick={onClose}>Cancel</Button>
            </InlineStack>
        </Card>
    </Modal>;
};
