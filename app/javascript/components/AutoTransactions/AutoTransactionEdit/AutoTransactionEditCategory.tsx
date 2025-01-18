import React, { useCallback, useState } from "react"
import { StateOption } from "../../../helpers/useFilterState";
import { GQCategories } from "../../../graphql/GQCategories";
import { Autocomplete } from "@shopify/polaris";

interface Props {
    autoTransaction: StateOption<any>;
}

export const AutoTransactionEditCategory: React.FC<Props> = ({ autoTransaction }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const { categoriesData } = GQCategories();
    const catOptions = categoriesData?.categories.map((cat) => { return { label: cat.id, value: cat.id } }) || [];
    const [options, setOptions] = useState(catOptions);

    function setInputValue(value) {
        const newAutoTran = { ...autoTransaction.current, categoryId: value };
        autoTransaction.setter(newAutoTran);
    }

    const updateText = useCallback(
        (value: string) => {
            setInputValue(value);

            if (value === '') {
                setOptions(catOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = catOptions.filter((option) =>
                option.label.match(filterRegex),
            );
            setOptions(resultOptions);
        },
        [catOptions],
    );

    const updateSelection = useCallback(
        (selected: string[]) => {
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
            label="Category"
            value={autoTransaction.current.categoryId}
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
        />
    );
};