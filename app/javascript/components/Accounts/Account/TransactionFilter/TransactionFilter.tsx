
import React, { useRef, useState } from "react";
import { AppliedFilterInterface, LegacyFilters } from "@shopify/polaris";
import debounce from "lodash.debounce";
import { CategoriesAutocomplete } from "./CategoriesAutocomplete";
import { TransactionTypeChoiceList } from "./TransactionTypeChoiceList";
import { StateOption } from "../../../../helpers/useFilterState";
import { AmountFilter, AmountLimit } from "./AmountFilter";

interface Props {
    query: string,
    setQuery: (string) => void;
    categories: StateOption<string[]>;
    transactionTypes: StateOption<string[]>;
    amountLimit: StateOption<AmountLimit>;
};

const DEBOUNCE_TIME = 500;

export const TransactionFilter: React.FC<Props> = ({ query, setQuery, categories, transactionTypes, amountLimit }) => {
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
        },
        {
            key: "amountFilter",
            label: "Amount",
            filter: <AmountFilter amountLimit={amountLimit} />,
            shortcut: true
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
    const alc = amountLimit.current;
    if (alc.low !== undefined || alc.high !== undefined) {
        const CAD = new Intl.NumberFormat('en-CA', { style: "currency", currency: "CAD" });

        const labels: string[] = [];
        if (alc.abs) labels.push("|");
        labels.push(alc.low === undefined ? "" : CAD.format(alc.low));
        labels.push(" .. ");
        labels.push(alc.high === undefined ? "" : CAD.format(alc.high));
        if (alc.abs) labels.push("|");

        appliedFilters.push({
            key: 'amountLimits',
            label: labels.join(""),
            onRemove: () => { amountLimit.setter({ abs: true }); }
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