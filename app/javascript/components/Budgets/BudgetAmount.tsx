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

    const [amount, setAmount] = useState<number>(0);

    const selectMe = () => {
        setAmount(category.budgetAmount || 0);
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
        editing.setter({ ...editing.current, budgetAmount: amount });
    }

    const strAmount = (amount / 100.0).toFixed(2);

    const setNewAmount = (amount) => {
        var re = /[-]?\d*\.?\d{0,2}/;
        const filtered = (amount.match(re) || []).join('');
        setAmount(Number(filtered) * 100);
    };
    return <TextField label=""
        value={strAmount}
        onChange={setNewAmount}
        onBlur={onEditComplete}
        autoComplete="off"
        focused
    />;
};
