import React, { useCallback, useState } from "react"
import { StateOption } from "../../../helpers/useFilterState";
import { GQCategories } from "../../../graphql/GQCategories";
import { Autocomplete } from "@shopify/polaris";
import { AutoTransactionType, TransactionType } from "../../../graphql/Types";

interface Props {
    transaction: StateOption<AutoTransactionType | TransactionType>;
    label?: string | null;
}

export const TransactionEditCategory: React.FC<Props> = ({ transaction, label = "Category" }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const { categoriesData } = GQCategories();
    const catOptions = categoriesData?.categories.map((cat) => { return { label: cat.id, value: cat.id } }) || [];
    const [options, setOptions] = useState(catOptions.slice(0, 5));

    function setInputValue(value) {
        const newAutoTran = { ...transaction.current, categoryId: value };
        transaction.setter(newAutoTran);
    }

    const updateText = useCallback(
        (value: string) => {
            setInputValue(value);

            if (value === '') {
                setOptions(catOptions.slice(0, 5));
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = catOptions.filter((option) =>
                option.label.match(filterRegex),
            );
            setOptions(resultOptions.slice(0, 5));
        },
        [catOptions],
    );

    const updateSelection = useCallback(
        (selected: string[]) => {
            console.log("Selection: ", selected.join(","));
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = options.find((option) => {
                    return option.value.match(selectedItem);
                });
                return matchedOption && matchedOption.label;
            });

            setSelectedOptions(selected);
            setInputValue(selectedValue[0] || '');
        },
        [options],
    );

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label={label}
            value={transaction.current.categoryId}
            placeholder="gas, taxes, etc"
            autoComplete="off"
        />
    );

    return (
        <Autocomplete
            options={options}
            selected={selectedOptions}
            onSelect={updateSelection}
            textField={textField}
            preferredPosition="below"
        />
    );
};