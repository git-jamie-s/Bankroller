import React from "react";
import { ChoiceList } from '@shopify/polaris';
import { useState } from 'react';
import { GQTransactionTypes } from "../../../../queries/GQTransactionTypes";


interface Props {
    transactionTypes: string[],
    setTransactionTypes: (o: string[]) => void
};

export const TransactionTypeChoiceList: React.FC<Props> = ({ transactionTypes, setTransactionTypes }) => {
    const { transactionTypeData } = GQTransactionTypes();
    const data = transactionTypeData?.transactionTypes || [];

    const choices = data.map((tt) => {
        return { label: tt, value: tt };
    })

    return (
        <ChoiceList
            choices={choices}
            title="Types"
            selected={transactionTypes}
            onChange={setTransactionTypes}
            allowMultiple />
    );

}