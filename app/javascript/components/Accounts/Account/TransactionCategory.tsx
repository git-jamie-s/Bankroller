import React from "react"
import { GQCategories } from "../../../graphql/GQCategories";
import { Autocomplete } from "@mui/joy";

interface Props {
    currentCategory: string | undefined;
    setTransactionCategory(category: string);
}

export const TransactionCategory: React.FC<Props> = ({ currentCategory, setTransactionCategory }) => {
    const { categoriesData } = GQCategories();
    const allOptions = categoriesData?.categories.map((c) => c.id) || [];

    const onChange = (event, v) => {
        setTransactionCategory(v);
    }

    return (
        <Autocomplete
            freeSolo
            size="sm"
            sx={{ backgroundColor: "transparent" }}
            options={allOptions}
            value={currentCategory}
            onChange={onChange}
            placeholder="Category..."
        />
    );

};