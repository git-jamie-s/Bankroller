import React, { useRef, useState } from "react";
import { Text, IndexTable, Button } from "@shopify/polaris";
import { GQTransactions } from "../../../graphql/GQTransactions";
import { TransactionFilter } from "./TransactionFilter/TransactionFilter";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';
import { PageInfo, PaginationQueryParams } from "../../../graphql/PaginationType";
import { useFilterState } from "../../../helpers/useFilterState";
import { AmountLimit } from "./TransactionFilter/AmountFilter";
import { TransactionType } from "../../../graphql/Types";
import { GMUpdateTransaction } from "../../../graphql/GMUpdateTransaction";
import { TransactionRow } from "./TransactionRow";

interface Props {
    account: any;
};

export const Transactions: React.FC<Props> = ({ account }) => {
    const accountId = account.id;
    const [sort, setSort] = useState('date desc, id desc');
    const [updateTransaction] = GMUpdateTransaction();

    const resetPagination = () => {
        pageNumber.current = 1;
        setPagination({ first: pageSize.current });
    }

    const query = useFilterState<string>('', resetPagination);
    const categories = useFilterState<string[]>([], resetPagination);
    const transactionTypes = useFilterState([] as string[], resetPagination);
    const amountLimit = useFilterState<AmountLimit>({ low: undefined, high: undefined, abs: true });

    const pageNumber = useRef<number>(1);
    const pageSize = useRef<number>(50);
    const [pagination, setPagination] = useState<PaginationQueryParams>({ first: pageSize.current });

    const onEditComplete = ((value) => {
        if (value) {
            console.log("Saving transaction...", value);
            const sliced = { id: value.id, categoryId: value.categoryId, description: value.description };
            updateTransaction({ variables: { transaction: sliced } });
        }
    });

    const editingTransactionCat = useFilterState<TransactionType | null>(null, onEditComplete);
    const editingTransactionDesc = useFilterState<TransactionType | null>(null, onEditComplete);

    const { transactions, error } = GQTransactions(sort, accountId,
        query.current,
        categories.current,
        transactionTypes.current,
        amountLimit.current,
        pagination);
    if (error) return <p>Error : {error.message}</p>;

    const pageInfo: PageInfo = transactions?.pageInfo || {}

    const includeBalance = sort.startsWith("date");
    const includeAccount = accountId === "0";

    const rowMarkup = transactions?.edges.map(
        (edge, index) => {
            const transaction = edge.node;

            return <TransactionRow
                index={index}
                transaction={transaction}
                includeAccount={includeAccount}
                includeBalance={includeBalance}
                editingDescription={editingTransactionDesc}
                editingCategory={editingTransactionCat} />;
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
        resetPagination();
    }

    const dirIcon = desc ? ArrowDownIcon : ArrowUpIcon;
    function titleButton(label: string, sortVal: string) {
        const icon = (sort.startsWith(sortVal)) ? dirIcon : undefined;
        return <Button variant="tertiary"
            fullWidth
            textAlign="left"
            icon={icon}
            onClick={() => handleSortClick(sortVal)}>{label}
        </Button>;
    }

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: 'date', title: titleButton("Date", "date") },
        { id: 'type', title: titleButton("Type", "transaction_type") },

        { id: 'description', title: titleButton("Description", "description") },
        { id: 'category', title: titleButton("Category", "category_id") },
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
                query={query}
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


