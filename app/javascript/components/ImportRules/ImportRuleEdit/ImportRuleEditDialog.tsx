import React from "react";
import { GQTransactionTypes } from "../../../graphql/GQTransactionTypes";
import { StateOption } from "../../../helpers/useFilterState";
import { ImportRuleEditAccount } from "./ImportRuleEditAccount";
import { ImportRuleType } from "../../../graphql/Types";
import { FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Select, Option, Stack, Button } from "@mui/joy";
import { TransactionEditCategory } from "./TransactionEditCategory";

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
        .map((tt, index) => <Option key={index} value={tt}>{tt}</Option>) || [];

    ttOptions.unshift(<Option key="(any)" value="">(any)</Option>);

    function setValue(value) {
        const newAutoTran = { ...importRule.current, ...value };
        importRule.setter(newAutoTran);
    }

    const onChangeDescription = (description) => { setValue({ description }) };
    const onSetTransactionType = (event, transactionType) => {
        console.log(event.target.value);
        setValue({ transactionType });
    };
    const onChangeAmount = (event) => {
        const amount = event.target.value;
        var re = /[-]?\d*\.?\d{0,2}/;
        const filtered = (amount.match(re) || []).join('');
        setValue({ amount: Number(filtered) * 100 })
    };
    if (importRule.current === null) {
        return null;
    }

    return (
        <>
            <Modal open={true} title={title} onClose={onClose}>
                <ModalDialog>
                    <ModalClose />
                    <FormControl>
                        <FormLabel>Description (use * for wildcard matching)</FormLabel>
                        <Input
                            value={importRule.current.description}
                            onChange={onChangeDescription}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Transaction Type</FormLabel>
                        <Select
                            value={importRule.current.transactionType || ""}
                            onChange={onSetTransactionType}
                        >
                            {ttOptions}
                        </Select>
                    </FormControl>
                    <TransactionEditCategory transaction={importRule as StateOption<ImportRuleType>} />
                    <FormControl>
                        <FormLabel>Amount</FormLabel>
                        <Input
                            onChange={onChangeAmount}
                            value={strAmount}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Account</FormLabel>
                        <ImportRuleEditAccount importRule={importRule} />
                    </FormControl>
                    <Stack direction="row" spacing="2px">
                        <Button color="neutral" onClick={onClose}>Cancel</Button>
                        <Button color="neutral" onClick={() => onSave(true)}>Save And Apply</Button>
                        <Button color="primary" onClick={() => onSave(false)}>Save</Button>
                    </Stack>
                </ModalDialog>
            </Modal >
        </>
    );
};
