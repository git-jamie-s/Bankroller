
import React, { useRef, useState } from "react";
import { AppliedFilterInterface, LegacyFilters } from "@shopify/polaris";
import debounce from "lodash.debounce";
import { CategoriesAutocomplete } from "./CategoriesAutocomplete";
import { TransactionTypeChoiceList } from "./TransactionTypeChoiceList";

interface Props {
    query: string,
    setQuery: (string) => void,
    categoryOptions: string[],
    setCategoryOptions: (o: string[]) => void
    transactionTypes: string[],
    setTransactionTypes: (o: string[]) => void
};

const DEBOUNCE_TIME = 500;

export const TransactionFilter: React.FC<Props> = ({ query, setQuery, categoryOptions, setCategoryOptions, transactionTypes, setTransactionTypes }) => {
    const [localQuery, setLocalQuery] = useState(query);

    const debouncedOnQueryChange = useRef<any>(
        debounce((nextValue) => { setQuery(nextValue) }, DEBOUNCE_TIME)
    ).current;

    const onQueryChange = (q) => {
        setLocalQuery(q);
        debouncedOnQueryChange(q);
    };

    const onClearAll = () => {
        setLocalQuery("");
        setCategoryOptions([]);
        setTransactionTypes([]);
    }

    const filters = [
        {
            key: 'category',
            label: 'Category',
            filter: <CategoriesAutocomplete
                selectedOptions={categoryOptions}
                setSelectedOptions={setCategoryOptions} />,
            shortcut: true,
        },
        {
            key: "transactionType",
            label: "Types",
            filter: <TransactionTypeChoiceList
                transactionTypes={transactionTypes}
                setTransactionTypes={setTransactionTypes} />,
            shortcut: true,
        }
    ];

    const appliedFilters: AppliedFilterInterface[] = [];
    if (categoryOptions.length > 0) {
        appliedFilters.push({
            key: 'categories',
            label: categoryOptions.map((val) => `${val}`).join(', '),
            onRemove: () => { setCategoryOptions([]) },
        });
    }
    if (transactionTypes.length > 0) {
        appliedFilters.push({
            key: 'transactionType',
            label: transactionTypes.join(","),
            onRemove: () => { setTransactionTypes([]) }
        });
    }

    return (<LegacyFilters
        filters={filters}
        appliedFilters={appliedFilters}
        queryValue={localQuery}
        queryPlaceholder="Search description"
        onQueryChange={onQueryChange}
        onQueryClear={() => onQueryChange("")}
        onClearAll={onClearAll}>

    </LegacyFilters>);
}