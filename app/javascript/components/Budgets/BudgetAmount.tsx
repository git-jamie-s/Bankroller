import React, { useState, useEffect } from "react"
import { Button, Select, TextField } from "@shopify/polaris";
import { CategoryType, PeriodEnum } from "../../graphql/Types";
import { StateOption } from "../../helpers/useFilterState";
import { FormatAmountString, FormatCAD } from "../../helpers/Formatter";


interface Props {
    editing: StateOption<CategoryType | null>;
    category: CategoryType;
}

export const BudgetAmount: React.FC<Props> = ({ editing, category }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                editing.setter(null);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const [amount, setAmount] = useState<string>("0");

    const selectMe = () => {
        const strAmount = category.budgetAmount ?
            (category.budgetAmount / 100.0).toFixed(2) : "0";

        setAmount(strAmount);
        editing.setter(category);
    }

    if (editing.current !== category) {
        return <Button
            fullWidth
            textAlign="start"
            variant="tertiary"
            onClick={selectMe}>
            {FormatAmountString(category.budgetAmount || 0)}
        </Button>;
    }

    const onEditComplete = () => {
        var re = /[-]?\d*\.?\d{0,2}/;
        const filtered = (amount.match(re) || []).join('');
        const num = (Number(filtered) * 100);
        editing.setter({ ...editing.current, budgetAmount: num });
    }

    // const strAmount = (amount / 100.0).toFixed(2);

    // const setNewAmount = (amount) => {
    // };
    return <TextField label=""
        value={amount}
        onChange={setAmount}
        onBlur={onEditComplete}
        autoComplete="off"
        focused
    />;
};
