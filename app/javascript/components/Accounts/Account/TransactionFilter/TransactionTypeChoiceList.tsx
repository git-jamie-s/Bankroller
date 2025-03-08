import React from "react";
import { GQTransactionTypes } from "../../../../graphql/GQTransactionTypes";
import { StateOption } from "../../../../helpers/useFilterState";
import { Autocomplete } from "@mui/joy";

interface Props {
    transactionTypes: StateOption<string[]>
};

export const TransactionTypeChoiceList: React.FC<Props> = ({ transactionTypes }) => {
    const { transactionTypeData } = GQTransactionTypes();
    const data = transactionTypeData?.transactionTypes || [];

    const choices = data.map((tt) => {
        return { label: tt, value: tt };
    })

    const onChange = (event, v) => {
        transactionTypes.setter(v);
    }

    return (
        <Autocomplete
            sx={{ maxWidth: "200px" }}
            size="sm"
            multiple
            options={data}
            title="Types"
            onChange={onChange}
            value={transactionTypes.current}
            placeholder="Transaction Type"
        />
    );

}