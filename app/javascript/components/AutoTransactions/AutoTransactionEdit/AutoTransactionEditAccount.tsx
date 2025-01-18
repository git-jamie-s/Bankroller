import React, { useCallback, useState } from "react"
import { StateOption } from "../../../helpers/useFilterState";
import { Autocomplete, Select } from "@shopify/polaris";
import { GQAccounts } from "../../../graphql/GQAccounts";

interface Props {
    autoTransaction: StateOption<any>;
}

export const AutoTransactionEditAccount: React.FC<Props> = ({ autoTransaction }) => {
    const { accountsData } = GQAccounts();
    const accounts = accountsData?.accounts || [];

    const options = accounts.map((act) => { return { label: act.accountName, value: act.id } });
    options.unshift({ label: "(any)", value: "", id: "0" });

    const onChange = (value) => {
        if (value === "0") {
            autoTransaction.setter({ ...autoTransaction.current, account: null });
        }
        else {
            // Find the account object
            const account = accounts.find((a) => { return a.id.toString() === value });
            const newAT = { ...autoTransaction.current, account: account };
            autoTransaction.setter(newAT);
        }
    }

    return (
        <Select
            options={options}
            label="Account"
            onChange={onChange}
            value={autoTransaction.current.account?.id || "0"}
        />
    );
};