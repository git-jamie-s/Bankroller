import React, { useCallback, useState } from "react"
import { StateOption } from "../../../helpers/useFilterState";
import { GQCategories } from "../../../graphql/GQCategories";
import { ImportRuleType, TransactionType } from "../../../graphql/Types";
import { Select, Option } from "@mui/joy";

interface Props {
    transaction: StateOption<ImportRuleType | TransactionType>;
    label?: string | null;
}

export const TransactionEditCategory: React.FC<Props> = ({ transaction, label = "Category" }) => {

    const { categoriesData } = GQCategories();
    const categories = categoriesData.categories || [];
    const allOptions = categories.map((c) => <Option key={c.id} value={c.id}>{c.id}</Option>)

    function setInputValue(event, newValue) {
        if (event === null) return;

        console.log("New cat: ", newValue);
        const newAutoTran = { ...transaction.current, categoryId: newValue };
        transaction.setter(newAutoTran);
    }

    return (
        <Select
            value={transaction.current.categoryId}
            onChange={setInputValue}
            placeholder="Category..."
        >
            {allOptions}
        </Select>
    );
};