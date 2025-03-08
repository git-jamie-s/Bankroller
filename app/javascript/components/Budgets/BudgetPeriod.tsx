import React, { } from "react"
import { CategoryType, PeriodEnum } from "../../graphql/Types";
import { GMUpdateCategory } from "../../graphql/GMUpdateCategory";
import { Select, Option } from "@mui/joy";


interface Props {
    category: CategoryType;
}

export const BudgetPeriod: React.FC<Props> = ({ category }) => {
    const [updateCategory] = GMUpdateCategory();

    const options = [
        <Option value={PeriodEnum.Weekly}>Weekly</Option>,
        <Option value={PeriodEnum.TwoWeeks}>Two Weeks</Option>,
        <Option value={PeriodEnum.Monthly}>Monthly</Option>,
        <Option value={PeriodEnum.Yearly}>Yearly</Option>,
    ];

    const onChange = (event) => {
        const value = event.target.value;
        const period = value as PeriodEnum;
        updateCategory({ variables: { category: { id: category.id, budgetPeriod: period, budgetAmount: category.budgetAmount } } });
    };

    return <Select
        value={category.budgetPeriod}
        onChange={onChange}
    >
        {options}
    </Select>
};
