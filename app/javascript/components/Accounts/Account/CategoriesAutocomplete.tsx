import React from "react";
import { LegacyStack, Tag, Autocomplete, Spinner } from '@shopify/polaris';
import { useState, useCallback, useMemo } from 'react';
import { GQCategories } from "../../../queries/GQCategories";


interface Props {
    selectedOptions: string[],
    setSelectedOptions: (string) => void
};

export const CategoriesAutocomplete: React.FC<Props> = ({ selectedOptions, setSelectedOptions }) => {
    const [inputValue, setInputValue] = useState('');

    const { categoriesData, loading } = GQCategories();
    const data = categoriesData?.categories || [];

    const deselectedOptions = data.map((c) => {
        return { value: c.category, label: c.category };
    })
    const [options, setOptions] = useState(deselectedOptions);

    function titleCase(string: string) {
        return string
            .toLowerCase()
            .split(' ')
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join('');
    }

    const updateText = useCallback(
        (value: string) => {
            setInputValue(value);

            if (value === '') {
                setOptions(deselectedOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = deselectedOptions.filter((option) =>
                option.label.match(filterRegex),
            );

            setOptions(resultOptions);
        },
        [deselectedOptions],
    );

    const removeTag = useCallback(
        (tag: string) => () => {
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);
            setSelectedOptions(options);
        },
        [selectedOptions],
    );

    const verticalContentMarkup =
        selectedOptions.length > 0 ? (
            <LegacyStack spacing="extraTight" alignment="center">
                {selectedOptions.map((option) => {
                    let tagLabel = '';
                    tagLabel = option.replace('_', ' ');
                    tagLabel = titleCase(tagLabel);
                    return (
                        <Tag key={`option${option}`} onRemove={removeTag(option)}>
                            {tagLabel}
                        </Tag>
                    );
                })}
            </LegacyStack>
        ) : null;

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label="Tags"
            value={inputValue}
            placeholder="gas, insurance, cleaning..."
            verticalContent={verticalContentMarkup}
            autoComplete="off"
        />
    );

    return (
        <div style={{ height: '325px' }}>
            <Autocomplete
                loading={loading}
                allowMultiple
                options={options}
                selected={selectedOptions}
                textField={textField}
                onSelect={setSelectedOptions}
                listTitle="Suggested Tags"
            />
        </div>
    );

}