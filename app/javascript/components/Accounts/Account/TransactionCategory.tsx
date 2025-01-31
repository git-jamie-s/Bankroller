import React, { useCallback, useState, useEffect } from "react"
import { TransactionType } from "../../../graphql/Types";
import { Button, Combobox, Icon, Listbox } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { GQCategories } from "../../../graphql/GQCategories";
import { StateOption } from "../../../helpers/useFilterState";

interface Props {
    index: number;
    editing: StateOption<TransactionType | null>;
    transaction: TransactionType;
}

export const TransactionCategory: React.FC<Props> = ({ index, editing, transaction }) => {
    const { categoriesData } = GQCategories();
    const allOptions = categoriesData?.categories.map((c) => {
        return { value: c.id, label: c.id }
    }) || [];

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

    const [text, setText] = useState<string>(transaction.categoryId || "");
    const [selectedOption, setSelectedOption] = useState<string | undefined>();
    const [options, setOptions] = useState(allOptions);

    const selectMe = () => {
        setText(transaction.categoryId || "");
        editing.setter(transaction);
    }

    const updateText = useCallback(
        (value: string) => {
            setText(value);

            if (value === '') {
                setOptions(allOptions);
                return;
            }
            const resultOptions = allOptions.filter((option) => option.label.includes(value));
            setOptions(resultOptions);
        },
        [allOptions],
    );

    const updateSelection = useCallback(
        (selected: string) => {
            const matchedOption = options.find((option) => {
                return option.value.match(selected);
            });

            setSelectedOption(selected);
            editing.setter({ ...editing.current, categoryId: selected });
        },
        [options],
    );

    const optionsMarkup =
        options.length > 0
            ? options.map((option) => {
                const { label, value } = option;

                return (
                    <Listbox.Option
                        key={`${value}`}
                        value={value}
                        selected={selectedOption === value}
                        accessibilityLabel={label}
                    >
                        {label}
                    </Listbox.Option>
                );
            })
            : null;

    if (editing.current !== transaction) {
        return <Button
            fullWidth
            textAlign="start"
            variant="tertiary"
            onClick={selectMe}>
            {transaction.categoryId}
        </Button>;
    }

    return (
        <Combobox
            height="250px"
            activator={
                <Combobox.TextField
                    prefix={<Icon source={SearchIcon} />}
                    onChange={updateText}
                    onClearButtonClick={() => updateText("")}
                    label="Category"
                    labelHidden
                    value={text}
                    placeholder="Search tags"
                    autoComplete="off"
                    variant="borderless"
                    autoFocus
                    clearButton
                />
            }
        >
            {options.length > 0 ? (
                <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
            ) : null}
        </Combobox>
    );

};