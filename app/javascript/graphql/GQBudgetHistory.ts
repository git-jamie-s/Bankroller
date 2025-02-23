import { useQuery, gql } from '@apollo/client';
import { PaginationQueryParams } from './PaginationType';
import { AmountLimit } from '../components/Accounts/Account/TransactionFilter/AmountFilter';

export function GQBudgetHistory(categoryId: string) {
    const GET_BUDGET_HISTORY = gql`
        query GetBudgetHistory(
            $categoryId: String!
            ) {
            budgetHistory(
                categoryId: $categoryId
            ) {
                date
                amount
                budget
            }
        }`;

    const { data, loading, error } = useQuery(GET_BUDGET_HISTORY, {
        variables: {
            categoryId,
        }
    });

    const budgetHistory = data?.budgetHistory || [];

    return { budgetHistory, loading, error };
}