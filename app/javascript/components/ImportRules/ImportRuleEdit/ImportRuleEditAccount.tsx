import React, { useCallback, useState } from "react"
import { StateOption } from "../../../helpers/useFilterState";
import { Autocomplete, Select } from "@shopify/polaris";
import { GQAccounts } from "../../../graphql/GQAccounts";

interface Props {
    importRule: StateOption<any>;
}

export const ImportRuleEditAccount: React.FC<Props> = ({ importRule }) => {
    const { accountsData } = GQAccounts();
    const accounts = accountsData?.accounts || [];

    const options = accounts.map((act) => { return { label: act.accountName, value: act.id } });
    options.unshift({ label: "(any)", value: "", id: "0" });

    const onChange = (value) => {
        if (value === "0") {
            importRule.setter({ ...importRule.current, account: null });
        }
        else {
            // Find the account object
            const account = accounts.find((a) => { return a.id.toString() === value });
            const newImportRule = { ...importRule.current, account: account };
            importRule.setter(newImportRule);
        }
    }

    return (
        <Select
            options={options}
            label="Account"
            onChange={onChange}
            value={importRule.current.account?.id || "0"}
        />
    );
};