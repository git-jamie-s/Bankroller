import React, { useState } from "react";
import { Text, EmptySearchResult, IndexTable, Spinner, IndexFiltersProps, IndexFilters, IndexFiltersMode, useSetIndexFiltersMode, Icon, Button } from "@shopify/polaris";
import { useQuery, gql } from '@apollo/client';
import { FormatCAD } from "../../../helpers/Formatter";
import { GQTransactions } from "../../../queries/GQTransactions";
import { TransactionFilter } from "./TransactionFilter";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { CaretUpIcon, CaretDownIcon, ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';

interface Props {
    account: any;
};

export const Transactions: React.FC<Props> = ({ account }) => {
    const accountId = account.id;
    const [sort, setSort] = useState('date desc, id desc');

    const [queryValue, setQueryValue] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([] as string[]);

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No transactions found'}
            description={'Try changing the filters or search term'}
            withIllustration
        />
    );

    const { transactions, loading, error } = GQTransactions(sort, accountId, queryValue, categoryOptions, 50);
    if (error) return <p>Error : {error.message}</p>;
    if (loading) return <Spinner />;

    const includeBalance = sort.startsWith("date");

    const rowMarkup = transactions.edges.map(
        (edge, index) => {
            const transaction = edge.node;
            const amount = FormatCAD(transaction.amount);
            const balance = FormatCAD(transaction.balance);

            return (
                <IndexTable.Row id={transaction.id} key={transaction.id} position={index}>
                    <IndexTable.Cell>{transaction.date}</IndexTable.Cell>
                    <IndexTable.Cell>{transaction.transactionType}</IndexTable.Cell>
                    <IndexTable.Cell>{transaction.description}</IndexTable.Cell>
                    <IndexTable.Cell>{transaction.category?.category}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <Text as="span" alignment="end" numeric>
                            {amount}
                        </Text>
                    </IndexTable.Cell>
                    {includeBalance && (<IndexTable.Cell>
                        <Text as="span" alignment="end" numeric>
                            {balance}
                        </Text>
                    </IndexTable.Cell>)}
                </IndexTable.Row>
            )
        }
    );

    const resourceName = {
        singular: 'transaction',
        plural: 'transactions',
    };

    const desc = sort.includes(" desc");

    const handleSortClick = (sortVal) => {
        const sameCol = sort.startsWith(sortVal);

        const newDesc = sameCol == desc ? "asc" : "desc";
        const newSortVal = `${sortVal} ${newDesc}, id ${newDesc}`;
        console.log(newSortVal);
        setSort(newSortVal);
    }

    const dirIcon = desc ? ArrowDownIcon : ArrowUpIcon;
    function titleButton(label: string, sortVal: string) {
        const icon = (sort.startsWith(sortVal)) ? dirIcon : undefined;
        return <Button variant="tertiary" fullWidth textAlign="left" icon={icon} onClick={() => handleSortClick(sortVal)}>{label}</Button>
    }

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: 'date', title: titleButton("Date", "date") },
        { id: 'type', title: titleButton("Type", "transaction_type") },

        { id: 'description', title: titleButton("Description", "description") },
        { id: 'category', title: titleButton("Category", "category") },
        { id: 'amount', title: titleButton("Amount", "amount") },
    ];

    if (includeBalance) {
        headings.push({
            id: 'balance',
            title: (
                <Text as="span" alignment="end">
                    Balance
                </Text>
            ),
        } as IndexTableHeading);
    }

    return (
        <>
            <TransactionFilter
                query={queryValue}
                setQuery={setQueryValue}
                categoryOptions={categoryOptions}
                setCategoryOptions={setCategoryOptions} />
            <IndexTable
                resourceName={resourceName}
                itemCount={200}
                selectable={false}
                hasZebraStriping
                headings={headings}
            >
                {rowMarkup}
            </IndexTable >
        </>
    );
};


