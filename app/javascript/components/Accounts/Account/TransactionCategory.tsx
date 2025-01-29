import React, { useCallback, useState, useEffect } from "react"
import { TransactionType } from "../../../graphql/Types";
import { ActionList, Button, ButtonGroup, Combobox, Icon, InlineStack, Listbox, Popover } from "@shopify/polaris";
import { SearchIcon, ChevronDownIcon } from "@shopify/polaris-icons";
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
    const [active, setActive] = React.useState<string | null>(null);

    const selectMe = () => {
        setText(transaction.categoryId || "");
        editing.setter(transaction);
    }

    const updateText = useCallback(
        (value: string) => {
            console.log("updateText: ", value);
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
            console.log("update selection: ", selected);
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

    const toggleActive = (id: string) => () => {
        setActive((activeId) => (activeId !== id ? id : null));
    };

    if (editing.current !== transaction) {
        const popId = `popover-${index}`;
        const items = [
            {
                content: "Create Rule",
                onAction: () => { }
            },
            {
                content: "Schedule",
                onAction: () => { }
            }
        ];

        const menu = transaction.categoryId && (
            <Popover
                active={popId === active}
                preferredAlignment="right"
                activator={
                    <Button
                        fullWidth={false}
                        size="slim"
                        onClick={toggleActive(popId)}
                        icon={ChevronDownIcon}
                        accessibilityLabel="Account list"
                    />
                }
                autofocusTarget="first-node"
                onClose={toggleActive('popover2')}
            >
                <ActionList
                    actionRole="menuitem"
                    items={items}
                />
            </Popover>
        );

        const butt = (
            <InlineStack wrap={false}>
                <Button
                    fullWidth
                    textAlign="start"
                    variant="tertiary"
                    onClick={selectMe}>
                    {transaction.categoryId}
                </Button>
                {menu}
            </InlineStack>);
        return butt;
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