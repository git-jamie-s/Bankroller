
import React, { useRef, useState } from "react";
import { AppliedFilterInterface, LegacyFilters } from "@shopify/polaris";
import debounce from "lodash.debounce";
import { CategoriesAutocomplete } from "./CategoriesAutocomplete";
import { TransactionTypeChoiceList } from "./TransactionTypeChoiceList";
import { StateOption } from "../../../../helpers/useFilterState";

interface Props {
    query: string,
    setQuery: (string) => void,
    categories: StateOption<string[]>,
    transactionTypes: StateOption<string[]>,
};

const DEBOUNCE_TIME = 500;

export const TransactionFilter: React.FC<Props> = ({ query, setQuery, categories, transactionTypes }) => {
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
        categories.setter([]);
        transactionTypes.setter([]);
    }

    const filters = [
        {
            key: 'category',
            label: 'Category',
            filter: <CategoriesAutocomplete categories={categories} />,
            shortcut: true,
        },
        {
            key: "transactionType",
            label: "Types",
            filter: <TransactionTypeChoiceList transactionTypes={transactionTypes} />,
            shortcut: true,
        }
    ];

    const appliedFilters: AppliedFilterInterface[] = [];
    if (categories.current.length > 0) {
        appliedFilters.push({
            key: 'categories',
            label: categories.current.map((val) => `${val}`).join(', '),
            onRemove: () => { categories.setter([]) },
        });
    }
    if (transactionTypes.current.length > 0) {
        appliedFilters.push({
            key: 'transactionType',
            label: transactionTypes.current.join(","),
            onRemove: () => { transactionTypes.setter([]) }
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