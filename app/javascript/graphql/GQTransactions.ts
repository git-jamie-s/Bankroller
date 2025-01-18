import { useQuery, gql } from '@apollo/client';
import { PaginationQueryParams } from './PaginationType';
import { AmountLimit } from '../components/Accounts/Account/TransactionFilter/AmountFilter';

export function GQTransactions(order: string,
    accountId: string,
    query: string,
    categories: string[],
    transactionTypes: string[],
    amountLimit: AmountLimit,
    pagination: PaginationQueryParams
) {
    const GET_TRANSACTIONS = gql`
        query GetTransactions(
            $accountId: ID!
            $query: String
            $categories: [String!]
            $transactionTypes: [String!]
            $minAmount: Int
            $maxAmount: Int
            $absAmount: Boolean!
            $order: String
            $first: Int
            $last: Int
            $after: String
            $before: String
            ) {
            transactions(
                accountId: $accountId
                query: $query
                categories: $categories
                transactionTypes: $transactionTypes
                minAmount: $minAmount
                maxAmount: $maxAmount
                absAmount: $absAmount
                order: $order
                first: $first
                last: $last
                after: $after
                before: $before
            ) {
                edges {
                    node {
                        id
                        date
                        transactionType
                        description
                        categoryId
                        account {
                            accountName
                        }
                        amount
                        balance
                    }
                }
                totalCount
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
            }
        }`;

    const minAmount = amountLimit.low ? amountLimit.low * 100 : undefined;
    const maxAmount = amountLimit.high ? amountLimit.high * 100 : undefined;

    const { data, loading, error } = useQuery(GET_TRANSACTIONS, {
        variables: {
            accountId,
            query,
            categories,
            transactionTypes,
            order,
            first: pagination.first,
            last: pagination.last,
            after: pagination.after,
            before: pagination.before,
            minAmount,
            maxAmount,
            absAmount: amountLimit.abs
        }
    });

    const transactions = data?.transactions;

    return { transactions, loading, error };
}