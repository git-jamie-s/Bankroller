import React, { useRef, useState } from "react";
import { Text, EmptySearchResult, IndexTable, Spinner, Button } from "@shopify/polaris";
import { FormatCAD } from "../../../helpers/Formatter";
import { GQTransactions } from "../../../queries/GQTransactions";
import { TransactionFilter } from "./TransactionFilter/TransactionFilter";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';
import { PageInfo, PaginationQueryParams } from "../../../queries/PaginationType";
import { useFilterState } from "../../../helpers/useFilterState";
import { AmountLimit } from "./TransactionFilter/AmountFilter";

interface Props {
    account: any;
};

export const Transactions: React.FC<Props> = ({ account }) => {
    const accountId = account.id;
    const [sort, setSort] = useState('date desc, id desc');

    const [queryValue, setQueryValue] = useState('');


    const resetPagination = () => {
        pageNumber.current = 1;
        setPagination({ first: pageSize.current });
    }

    const categories = useFilterState<string[]>([], resetPagination);
    const transactionTypes = useFilterState([] as string[], resetPagination);
    const amountLimit = useFilterState<AmountLimit>({ low: undefined, high: undefined, abs: true });

    const pageNumber = useRef<number>(1);
    const pageSize = useRef<number>(50);
    const [pagination, setPagination] = useState<PaginationQueryParams>({ first: pageSize.current });


    const onSetQuery = (query) => {
        resetPagination();
        setQueryValue(query);
    }

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No transactions found'}
            description={'Try changing the filters or search term'}
            withIllustration
        />
    );

    const { transactions, loading, error } = GQTransactions(sort, accountId,
        queryValue,
        categories.current,
        transactionTypes.current,
        amountLimit.current,
        pagination);
    if (error) return <p>Error : {error.message}</p>;
    // if (loading) return <Spinner />;

    const pageInfo: PageInfo = transactions?.pageInfo || {}

    const includeBalance = sort.startsWith("date");
    const includeAccount = accountId === "0";

    const rowMarkup = transactions?.edges.map(
        (edge, index) => {
            const transaction = edge.node;
            const amount = FormatCAD(transaction.amount);
            const balance = FormatCAD(transaction.balance);
            const accountCell = includeAccount && (
                <IndexTable.Cell>{transaction.account.accountName}</IndexTable.Cell>
            );
            const balanceCell = includeBalance && (
                <IndexTable.Cell>
                    <Text as="span" alignment="end" numeric>
                        {balance}
                    </Text>
                </IndexTable.Cell>
            );

            return (
                <IndexTable.Row id={transaction.id} key={transaction.id} position={index}>
                    {accountCell}
                    <IndexTable.Cell>{transaction.date}</IndexTable.Cell>
                    <IndexTable.Cell>{transaction.transactionType}</IndexTable.Cell>
                    <IndexTable.Cell>{transaction.description}</IndexTable.Cell>
                    <IndexTable.Cell>{transaction.category?.category}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <Text as="span" alignment="end" numeric>
                            {amount}
                        </Text>
                    </IndexTable.Cell>
                    {balanceCell}
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

    if (includeAccount) {
        headings.unshift({ id: 'account', title: "Account" });
    }

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

    const pageCount = Math.ceil((transactions?.totalCount || 0) / pageSize.current);
    const onNextPage = () => {
        pageNumber.current++;
        setPagination({ first: pageSize.current, after: pageInfo.endCursor || undefined })
    }
    const onPreviousPage = () => {
        pageNumber.current--;
        setPagination({ last: pageSize.current, before: pageInfo.startCursor || undefined })
    }

    const paginationInfo = {
        hasNext: transactions?.pageInfo.hasNextPage,
        hasPrevious: transactions?.pageInfo.hasPreviousPage,
        onNext: onNextPage,
        onPrevious: onPreviousPage,
        type: "table",
        label: `Page ${pageNumber.current} of ${pageCount}`
    }

    return (
        <>
            <TransactionFilter
                query={queryValue}
                setQuery={onSetQuery}
                categories={categories}
                transactionTypes={transactionTypes}
                amountLimit={amountLimit} />
            <IndexTable
                resourceName={resourceName}
                itemCount={200}
                selectable={false}
                hasZebraStriping
                headings={headings}
                pagination={paginationInfo}
            >
                {rowMarkup}
            </IndexTable >
        </>
    );
};


