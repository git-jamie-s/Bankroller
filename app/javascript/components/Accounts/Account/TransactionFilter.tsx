
import React, { useRef, useState } from "react";
import { AppliedFilterInterface, LegacyFilters } from "@shopify/polaris";
import debounce from "lodash.debounce";
import { CategoriesAutocomplete } from "./CategoriesAutocomplete";

interface Props {
    query: string,
    setQuery: (string) => void,
    categoryOptions: string[],
    setCategoryOptions: (o: string[]) => void
};

const DEBOUNCE_TIME = 500;

export const TransactionFilter: React.FC<Props> = ({ query, setQuery, categoryOptions, setCategoryOptions }) => {
    const [localQuery, setLocalQuery] = useState(query);


    const debouncedOnQueryChange = useRef<any>(
        debounce((nextValue) => { setQuery(nextValue) }, DEBOUNCE_TIME)
    ).current;

    const onQueryChange = (q) => {
        setLocalQuery(q);
        debouncedOnQueryChange(q);
    };


    const noop = () => { };

    const onClearAll = () => {
        setLocalQuery("");
        setCategoryOptions([]);
    }


    const filters = [
        {
            key: 'category',
            label: 'Category',
            filter: <CategoriesAutocomplete selectedOptions={categoryOptions} setSelectedOptions={setCategoryOptions} />,
            shortcut: true,
        },
    ];

    const appliedFilters: AppliedFilterInterface[] = [];
    if (categoryOptions.length > 0) {
        appliedFilters.push({
            key: 'categories',
            label: categoryOptions.map((val) => `${val}`).join(', '),
            onRemove: () => { setCategoryOptions([]) },
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