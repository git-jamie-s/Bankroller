import React from "react";
import { ChoiceList } from '@shopify/polaris';
import { GQTransactionTypes } from "../../../../graphql/GQTransactionTypes";
import { StateOption } from "../../../../helpers/useFilterState";

interface Props {
    transactionTypes: StateOption<string[]>
};

export const TransactionTypeChoiceList: React.FC<Props> = ({ transactionTypes }) => {
    const { transactionTypeData } = GQTransactionTypes();
    const data = transactionTypeData?.transactionTypes || [];

    const choices = data.map((tt) => {
        return { label: tt, value: tt };
    })

    return (
        <ChoiceList
            choices={choices}
            title="Types"
            selected={transactionTypes.current}
            onChange={transactionTypes.setter}
            allowMultiple />
    );

}