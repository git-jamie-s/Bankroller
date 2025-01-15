import { useQuery, gql } from '@apollo/client';

export function GQTransactions(order: string,
    accountId: string,
    query: string,
    categories: string[],
    first: number = 10,
    last: number | undefined = undefined,
    after: string | undefined = undefined,
    before: string | undefined = undefined
) {
    console.log("Category Options: ", categories);
    const GET_TRANSACTIONS = gql`
        query GetTransactions(
            $accountId: ID!
            $query: String
            $categories: [String!]
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
                        amount
                        balance
                    }
                }
                totalCount
            }
        }`;

    const { data, loading, error } = useQuery(GET_TRANSACTIONS, {
        variables: { accountId, query, categories, order, first, last, after, before }
    });

    const transactions = data?.transactions;

    return { transactions, loading, error };
}