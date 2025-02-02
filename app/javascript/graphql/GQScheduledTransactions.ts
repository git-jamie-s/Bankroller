import { useQuery, gql } from '@apollo/client';
import { AmountLimit } from '../components/Accounts/Account/TransactionFilter/AmountFilter';

export function GQScheduledTransactions(
    order: string,
    query: string,
    transactionTypes: string[],
    accountId?: string | undefined,
) {
    const GET_SCHEDULED_TRANSACTIONS = gql`
        query GetScheduledTransactions(
            $accountId: ID
            $query: String
            $transactionTypes: [String!]
            $order: String
            ) {
            scheduledTransactions(
                accountId: $accountId
                query: $query
                transactionTypes: $transactionTypes
                order: $order
            ) {
                id
                account {
                    accountName
                }
                transactionType
                description
                minAmount
                maxAmount
                startDate
                period
                weekendAdjust
            }
        }`;

    const { data, loading, error } = useQuery(GET_SCHEDULED_TRANSACTIONS, {
        variables: {
            accountId,
            query,
            transactionTypes,
            order,
        }
    });

    const scheduledTransactions = data?.scheduledTransactions;
    return { scheduledTransactions, loading, error };
}