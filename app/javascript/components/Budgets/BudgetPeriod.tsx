import React, { useState, useEffect } from "react"
import { Button, Select, TextField } from "@shopify/polaris";
import { CategoryType, PeriodEnum } from "../../graphql/Types";
import { StateOption } from "../../helpers/useFilterState";
import { GMUpdateCategory } from "../../graphql/GMUpdateCategory";


interface Props {
    category: CategoryType;
}

export const BudgetPeriod: React.FC<Props> = ({ category }) => {
    const [updateCategory] = GMUpdateCategory();

    const options = [
        { value: PeriodEnum.Weekly, label: "Weekly" },
        { value: PeriodEnum.TwoWeeks, label: "Two weeks" },
        { value: PeriodEnum.TwiceMonthly, label: "Twice Monthly" },
        { value: PeriodEnum.Monthly, label: "Monthly" },
        { value: PeriodEnum.Yearly, label: "Yearly" },
    ];

    const onChange = (value: string) => {

        const period = value as PeriodEnum;
        updateCategory({ variables: { category: { id: category.id, budgetPeriod: period, budgetAmount: category.budgetAmount } } });
    };

    return <Select label=""
        value={category.budgetPeriod}
        onChange={onChange}
        options={options} />;
};
