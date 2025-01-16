import React, { useRef, useState } from "react";
import { Card, Button, Text, IndexTable, useIndexResourceState } from "@shopify/polaris";
import { GQAutoTransactions } from "../../queries/GQAutoTransactions";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon } from '@shopify/polaris-icons';
import { FormatCAD } from "../../helpers/Formatter";
import { TransactionFilter } from "../Accounts/Account/TransactionFilter/TransactionFilter";
import { useFilterState } from "../../helpers/useFilterState";
import { AmountLimit } from "../Accounts/Account/TransactionFilter/AmountFilter";
import { PageInfo, PaginationQueryParams } from "../../queries/PaginationType";

export const AutoTransactionsPage: React.FC = () => {

    const [sort, setSort] = useState('description asc');
    const desc = sort.includes(" desc");

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

    const { autoTransactions, loading, error } = GQAutoTransactions(
        sort,
        query.current,
        categories.current,
        transactionTypes.current,
        amountLimit.current,
        pagination);

    const resourceName = {
        singular: 'import rule',
        plural: 'import rules',
    };


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
        { id: 'description', title: titleButton("Matching Description", "description") },
        { id: 'type', title: titleButton("Matching Type", "transaction_type") },
        { id: 'category', title: titleButton("Matching category", "category_id") },
        { id: 'amount', title: titleButton("Matching amount", "amount") },
    ];

    const array = autoTransactions?.edges.map((edge) => edge.node) || [];

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(array);

    const rowMarkup = array.map(
        (autoTransaction, index) => {

            const amount = autoTransaction.amount && FormatCAD(autoTransaction.amount);

            return (
                <IndexTable.Row
                    id={autoTransaction.id}
                    key={autoTransaction.id}
                    position={index}
                    selected={selectedResources.includes(autoTransaction.id)}>
                    <IndexTable.Cell>{autoTransaction.description}</IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.transactionType}</IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.categoryId}</IndexTable.Cell>
                    <IndexTable.Cell>{amount}</IndexTable.Cell>
                </IndexTable.Row>
            )
        }
    );

    const buldDeleteTitle = selectedResources.length == 2 ?
        "Delete selected rule" : "Delete selected rules";

    const promotedBulkActions = [
        {
            icon: DeleteIcon,
            destructive: true,
            content: "Delete Selected Rules",
            onAction: () => console.log('Todo: implement bulk delete'),
        },
    ];

    const pageInfo: PageInfo = autoTransactions?.pageInfo || {}
    const pageCount = Math.ceil((autoTransactions?.totalCount || 0) / pageSize.current);
    const onNextPage = () => {
        pageNumber.current++;
        setPagination({ first: pageSize.current, after: pageInfo.endCursor || undefined })
    }
    const onPreviousPage = () => {
        pageNumber.current--;
        setPagination({ last: pageSize.current, before: pageInfo.startCursor || undefined })
    }

    const paginationInfo = {
        hasNext: autoTransactions?.pageInfo.hasNextPage,
        hasPrevious: autoTransactions?.pageInfo.hasPreviousPage,
        onNext: onNextPage,
        onPrevious: onPreviousPage,
        type: "table",
        label: `Page ${pageNumber.current} of ${pageCount}`
    }


    return (<>
        <Card>
            <Text as="h1">Import Rules</Text>
            <br />
            <TransactionFilter
                query={query}
                categories={categories}
                transactionTypes={transactionTypes}
                amountLimit={amountLimit} />
            <IndexTable
                resourceName={resourceName}
                headings={headings}
                itemCount={array.length}
                selectable
                hasZebraStriping
                loading={loading}
                onSelectionChange={handleSelectionChange}
                selectedItemsCount={selectedResources.length}
                promotedBulkActions={promotedBulkActions}
                pagination={paginationInfo}
            >
                {rowMarkup}
            </IndexTable>
        </Card>
    </>);
};

export default AutoTransactionsPage;