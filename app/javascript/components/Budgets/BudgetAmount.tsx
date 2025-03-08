import React, { useState, useEffect } from "react"
import { CategoryType, PeriodEnum } from "../../graphql/Types";
import { StateOption } from "../../helpers/useFilterState";
import { FormatAmountString, FormatCAD } from "../../helpers/Formatter";
import { Button, Input } from "@mui/joy";


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
            onClick={selectMe}
            variant="plain">
            {FormatAmountString(category.budgetAmount || 0)}
        </Button>;
    }

    const onEditComplete = () => {
        var re = /[-]?\d*\.?\d{0,2}/;
        const filtered = (amount.match(re) || []).join('');
        const num = (Number(filtered) * 100);
        editing.setter({ ...editing.current, budgetAmount: num });
    }

    const onSetAmount = ((event) => setAmount(event.target.value));

    return <Input
        fullWidth
        value={amount}
        onChange={onSetAmount}
        onBlur={onEditComplete}
    />;
};
