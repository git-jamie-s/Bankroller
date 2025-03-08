import React, { useCallback, useState } from "react"
import { StateOption } from "../../../helpers/useFilterState";
import { GQAccounts } from "../../../graphql/GQAccounts";
import { Select, Option } from "@mui/joy";

interface Props {
    importRule: StateOption<any>;
}

export const ImportRuleEditAccount: React.FC<Props> = ({ importRule }) => {
    const { accountsData } = GQAccounts();
    const accounts = accountsData?.accounts || [];

    const options = accounts.map((act) => <Option value={act.id.toString()}>{act.accountName}</Option>);
    options.unshift(<Option value={0}>(any)</Option>);

    const onChange = (event, newValue) => {
        if (event == null) { return }
        if (newValue === "0") {
            importRule.setter({ ...importRule.current, account: null });
        }
        else {
            // Find the account object
            const account = accounts.find((a) => { return a.id.toString() === newValue });
            const newImportRule = { ...importRule.current, account: account };
            importRule.setter(newImportRule);
        }
    }

    return (
        <Select
            onChange={onChange}
            value={importRule.current.account?.id || "0"}
        >
            {options}
        </Select>
    );
};