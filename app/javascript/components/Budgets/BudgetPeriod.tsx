import React, { useState, useEffect } from "react"
import { Button, Select, TextField } from "@shopify/polaris";
import { CategoryType, PeriodEnum } from "../../graphql/Types";
import { StateOption } from "../../helpers/useFilterState";


interface Props {
    editing: StateOption<CategoryType | null>;
    category: CategoryType;
}

export const BudgetPeriod: React.FC<Props> = ({ editing, category }) => {
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

    const [period, setPeriod] = useState<PeriodEnum>(category.budgetPeriod || PeriodEnum.Yearly);

    const selectMe = () => {
        setPeriod(category.budgetPeriod || PeriodEnum.Yearly);
        editing.setter(category);
    }

    if (editing.current !== category) {
        return <Button
            fullWidth
            textAlign="start"
            variant="tertiary"
            onClick={selectMe}>
            {category.budgetPeriod}
        </Button>;
    }

    const options = [
        { value: PeriodEnum.Weekly, label: "Weekly" },
        { value: PeriodEnum.TwoWeeks, label: "Two weeks" },
        { value: PeriodEnum.TwiceMonthly, label: "Twice Monthly" },
        { value: PeriodEnum.Monthly, label: "Monthly" },
        { value: PeriodEnum.Yearly, label: "Yearly" },
    ];

    const onEditComplete = () => {
        editing.setter({ ...editing.current, budgetPeriod: period });
    }


    return <Select label=""
        value={period}
        onChange={(v) => { setPeriod(v as PeriodEnum) }}
        onBlur={onEditComplete}
        options={options} />;
};
