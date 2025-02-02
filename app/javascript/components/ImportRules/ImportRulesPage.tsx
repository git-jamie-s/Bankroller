import React, { useRef, useState } from "react";
import { Card, Text } from "@shopify/polaris";
import { GQImportRules } from "../../graphql/GQImportRules";
import { TransactionFilter } from "../Accounts/Account/TransactionFilter/TransactionFilter";
import { useFilterState } from "../../helpers/useFilterState";
import { AmountLimit } from "../Accounts/Account/TransactionFilter/AmountFilter";
import { PageInfo, PaginationQueryParams } from "../../graphql/PaginationType";
import { ImportRulesList } from "./ImportRuleList";

export const ImportRulesPage: React.FC = () => {

    const resetPagination = () => {
        pageNumber.current = 1;
        setPagination({ first: pageSize.current });
    }

    const query = useFilterState<string>('', resetPagination);
    const categories = useFilterState<string[]>([], resetPagination);
    const transactionTypes = useFilterState([] as string[], resetPagination);
    const amountLimit = useFilterState<AmountLimit>({ low: undefined, high: undefined, abs: true }, resetPagination);
    const sorting = useFilterState<string>('description asc', resetPagination);

    const pageNumber = useRef<number>(1);
    const pageSize = useRef<number>(50);
    const [pagination, setPagination] = useState<PaginationQueryParams>({ first: pageSize.current });

    const { importRules, loading } = GQImportRules(
        sorting.current,
        query.current,
        categories.current,
        transactionTypes.current,
        amountLimit.current,
        pagination);

    const resourceName = {
        singular: 'import rule',
        plural: 'import rules',
    };

    const pageInfo: PageInfo = importRules?.pageInfo || {}
    const pageCount = Math.ceil((importRules?.totalCount || 0) / pageSize.current);
    const onNextPage = () => {
        pageNumber.current++;
        setPagination({ first: pageSize.current, after: pageInfo.endCursor || undefined })
    }
    const onPreviousPage = () => {
        pageNumber.current--;
        setPagination({ last: pageSize.current, before: pageInfo.startCursor || undefined })
    }

    const paginationInfo = {
        hasNext: importRules?.pageInfo.hasNextPage,
        hasPrevious: importRules?.pageInfo.hasPreviousPage,
        onNext: onNextPage,
        onPrevious: onPreviousPage,
        type: "table",
        label: `Page ${pageNumber.current} of ${pageCount}`
    }

    const array = importRules?.edges.map((edge) => edge.node) || [];

    return (<>
        <Card>
            <Text as="h1">Import Rules</Text>
            <br />
            <TransactionFilter
                query={query}
                categories={categories}
                transactionTypes={transactionTypes}
                amountLimit={amountLimit} />
            <ImportRulesList
                loading={loading}
                sorting={sorting}
                importRuleArray={array}
                paginationInfo={paginationInfo} />
        </Card>
    </>);
};

export default ImportRulesPage;
