import React from "react";
import { LegacyStack, Tag, Autocomplete, Spinner, BlockStack } from '@shopify/polaris';
import { useState, useCallback, useMemo } from 'react';
import { GQCategories } from "../../../../graphql/GQCategories";
import { StateOption } from "../../../../helpers/useFilterState";
import { CategoryType } from "../../../../graphql/Types";

interface Props {
    categories: StateOption<string[]>
};

export const CategoriesAutocomplete: React.FC<Props> = ({ categories }) => {
    const [inputValue, setInputValue] = useState('');

    const { categoriesData, loading } = GQCategories();
    const data = categoriesData?.categories || [];

    const allOptions = data.map((c: CategoryType) => {
        return { value: c.id, label: c.id };
    }).concat([{ value: "no category", label: "None" }]);

    const [options, setOptions] = useState(allOptions);

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
                setOptions(allOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = allOptions.filter((option) =>
                option.label.match(filterRegex),
            );

            setOptions(resultOptions);
        },
        [allOptions],
    );

    const selectedOptions = categories.current;

    const removeTag = useCallback(
        (tag: string) => () => {
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);
            categories.setter(options);
        },
        [selectedOptions],
    );

    const verticalContentMarkup =
        selectedOptions.length > 0 ? (
            <BlockStack>
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
            </BlockStack>
        ) : null;

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label="Categories"
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
                onSelect={categories.setter}
                listTitle="Suggested Tags"
            />
        </div>
    );

}