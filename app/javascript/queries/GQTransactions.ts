import { useQuery, gql } from '@apollo/client';
import { PaginationQueryParams } from './PaginationType';

export function GQTransactions(order: string,
    accountId: string,
    query: string,
    categories: string[],
    transactionTypes: string[],
    pagination: PaginationQueryParams
) {
    console.log(pagination);
    const GET_TRANSACTIONS = gql`
        query GetTransactions(
            $accountId: ID!
            $query: String
            $categories: [String!]
            $transactionTypes: [String!]
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
                        category {
                            category
                        }
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
            before: pagination.before
        }
    });

    const transactions = data?.transactions;

    return { transactions, loading, error };
}