import React, { useState } from "react";
import { Card, Modal, Select, TextField, Button, InlineStack } from '@shopify/polaris';
import { GQTransactionTypes } from "../../../graphql/GQTransactionTypes";
import { TransactionEditCategory } from "./TransactionEditCategory";
import { StateOption } from "../../../helpers/useFilterState";
import { ImportRuleEditAccount } from "./ImportRuleEditAccount";
import { ImportRuleType } from "../../../graphql/Types";

interface Props {
    importRule: StateOption<ImportRuleType | null>;
    onClose: () => void;
    onSave: (apply: boolean) => void;
    title?: string | undefined;
}

export const ImportRuleEditDialog: React.FC<Props> = ({ importRule, onSave, onClose, title = "Edit Import Rule" }) => {
    const curAutoAmount = (importRule.current?.amount || 0) / 100.0;
    const strAmount = curAutoAmount === 0 ? "" : curAutoAmount.toFixed(2);

    const { transactionTypeData } = GQTransactionTypes();

    const ttOptions = transactionTypeData?.transactionTypes
        .filter((tt) => tt !== "LEDGER")
        .map((tt) => { return { label: tt, value: tt } }) || [];

    ttOptions.unshift({ label: "(any)", value: "" })

    function setValue(value) {
        const newAutoTran = { ...importRule.current, ...value };
        importRule.setter(newAutoTran);
    }

    const onChangeDescription = (description) => { setValue({ description }) };
    const onSetTransactionType = (transactionType) => { setValue({ transactionType }) };
    const onChangeAmount = (amount) => {
        var re = /[-]?\d*\.?\d{0,2}/;
        const filtered = (amount.match(re) || []).join('');
        setValue({ amount: Number(filtered) * 100 })
    };
    if (importRule.current === null) {
        return null;
    }

    return <Modal open={true} title={title} onClose={onClose}>
        <Card>
            <TextField
                label="Description (use * for wildcard matching)"
                value={importRule.current.description}
                onChange={onChangeDescription}
                autoComplete="off"
            />
            <Select
                options={ttOptions}
                label="Transaction Type"
                value={importRule.current.transactionType || ""}
                onChange={onSetTransactionType}
            />
            <TransactionEditCategory transaction={importRule as StateOption<ImportRuleType>} />
            <TextField
                clearButton
                label="Amount"
                type="currency"
                autoComplete="off"
                onChange={onChangeAmount}
                onClearButtonClick={() => { onChangeAmount("") }}
                value={strAmount}
            />
            <ImportRuleEditAccount importRule={importRule} />
        </Card>
        <Card>
            <InlineStack align="center" gap="025">
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onSave(true)}>Save And Apply</Button>
                <Button variant="primary" onClick={() => onSave(false)}>Save</Button>
            </InlineStack>
        </Card>
    </Modal >;
};
