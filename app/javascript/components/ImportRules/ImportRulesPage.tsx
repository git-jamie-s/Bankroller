import React, { useRef, useState } from "react";
import { GQImportRules } from "../../graphql/GQImportRules";
import { TransactionFilter } from "../Accounts/Account/TransactionFilter/TransactionFilter";
import { useFilterState } from "../../helpers/useFilterState";
import { AmountLimit } from "../Accounts/Account/TransactionFilter/AmountFilter";
import { PageInfo, PaginationQueryParams } from "../../graphql/PaginationType";
import { ImportRulesList } from "./ImportRuleList";
import { Card, Typography } from "@mui/joy";
import Paginator from "../Accounts/Account/Paginator";

export const ImportRulesPage: React.FC = () => {

    const resetPagination = () => {
        pageNumber.current = 0;
        setPagination({ first: pageSize.current });
    }

    const query = useFilterState<string>('', resetPagination);
    const category = useFilterState<string>("", resetPagination);
    const transactionTypes = useFilterState([] as string[], resetPagination);
    const amountLimit = useFilterState<AmountLimit>({ low: undefined, high: undefined, abs: true }, resetPagination);
    const sorting = useFilterState<string>('description asc', resetPagination);

    const pageNumber = useRef<number>(0);
    const pageSize = useRef<number>(50);
    const [pagination, setPagination] = useState<PaginationQueryParams>({ first: pageSize.current });

    const categories = category.current?.length > 0 ? [category.current] : [];
    const { importRules, loading } = GQImportRules(
        sorting.current,
        query.current,
        categories,
        transactionTypes.current,
        amountLimit.current,
        pagination);

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

    const paginator = <Paginator
        rowCount={importRules?.totalCount || 0}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
    />;

    const array = importRules?.edges.map((edge) => edge.node) || [];

    return (
        <Card>
            <Typography>Import Rules</Typography>
            <TransactionFilter
                query={query}
                category={category}
                transactionTypes={transactionTypes}
                amountLimit={amountLimit} />
            <ImportRulesList
                loading={loading}
                sorting={sorting}
                importRuleArray={array}
                paginator={paginator} />
        </Card>
    );
};

export default ImportRulesPage;
