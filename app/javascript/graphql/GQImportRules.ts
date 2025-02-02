
import { useQuery, gql } from '@apollo/client';
import { AmountLimit } from '../components/Accounts/Account/TransactionFilter/AmountFilter';
import { PaginationQueryParams } from './PaginationType';

export function GQImportRules(
    order: string,
    query: string,
    categories: string[],
    transactionTypes: string[],
    amountLimit: AmountLimit,
    pagination: PaginationQueryParams
) {
    const GET_IMPORT_RULES = gql`
        query GetImportRules(
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
            importRules(
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
                        description
                        categoryId
                        transactionType
                        amount
                        account {
                            id
                            accountName
                        }
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

    const { data, loading, error } = useQuery(GET_IMPORT_RULES, {
        variables: {
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

    const importRules = data?.importRules;

    return { importRules, loading, error };
}