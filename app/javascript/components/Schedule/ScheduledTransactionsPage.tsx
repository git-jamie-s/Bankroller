import React, { } from "react";
import { useFilterState } from "../../helpers/useFilterState";
import { GQScheduledTransactions } from "../../graphql/GQScheduledTransactions";
import { ScheduledTransactionsList } from "./ScheduledTransactionsList";
import { Card, Typography } from "@mui/joy";

export const ScheduledTransactionsPage: React.FC = () => {

    // const resetPagination = () => {
    //     pageNumber.current = 1;
    //     setPagination({ first: pageSize.current });
    // }

    const query = useFilterState<string>('');
    const transactionTypes = useFilterState([] as string[]);
    const sorting = useFilterState<string>('description asc');
    const accountId = undefined;

    const { scheduledTransactions, loading } = GQScheduledTransactions(
        sorting.current,
        query.current,
        transactionTypes.current,
        accountId,
    );

    const resourceName = {
        singular: 'import rule',
        plural: 'import rules',
    };

    const array = scheduledTransactions || [];

    return (<>
        <Card>
            <Typography component="h1">Scheduled Transactions</Typography>
            <br />
            {/* <TransactionFilter
                query={query}
                categories={categories}
                transactionTypes={transactionTypes}
                amountLimit={amountLimit} /> */}
            <ScheduledTransactionsList
                loading={loading}
                sorting={sorting}
                scheduledTransactionArray={array}
            />
        </Card>
    </>);
};

export default ScheduledTransactionsPage;