
import React, { useRef, useState } from "react";
import debounce from "lodash.debounce";
import { TransactionTypeChoiceList } from "./TransactionTypeChoiceList";
import { StateOption } from "../../../../helpers/useFilterState";
import { AmountFilter, AmountLimit } from "./AmountFilter";
import { Input, Stack, Box } from "@mui/joy";
import { Search } from "@mui/icons-material";
import { TransactionCategory } from "../TransactionCategory";

interface Props {
    query: StateOption<string>;
    category: StateOption<string>;
    transactionTypes: StateOption<string[]>;
    amountLimit: StateOption<AmountLimit>;
};

const DEBOUNCE_TIME = 500;

export const TransactionFilter: React.FC<Props> = ({ query, category, transactionTypes, amountLimit }) => {
    const [localQuery, setLocalQuery] = useState<string>(query.current);

    const debouncedOnQueryChange = useRef<any>(
        debounce((nextValue) => { query.setter(nextValue) }, DEBOUNCE_TIME)
    ).current;

    const onQueryChange = (event) => {
        const v = event.target.value;
        setLocalQuery(v);
        debouncedOnQueryChange(v);
    };

    return (<Stack direction="row" spacing="2px"
        sx={{ alignItems: "flex-end" }}>
        <span>Filters:&nbsp;</span>
        <Input size="sm" startDecorator={<Search />} placeholder="Description" value={localQuery} onChange={onQueryChange} />
        <TransactionTypeChoiceList transactionTypes={transactionTypes} />
        <TransactionCategory
            currentCategory={category.current}
            setTransactionCategory={(v) => { category.setter(v) }}
        />
        <AmountFilter amountLimit={amountLimit} />
    </Stack>);
}