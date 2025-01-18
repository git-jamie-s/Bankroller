
import { useQuery, gql } from '@apollo/client';

export function GQCategories() {

    const GET_CATEGORIES = gql`
    query GetCategories {
        categories {
            id
            budgetAmount
            budgetPeriod
        }
    }`;
    const { data: categoriesData, loading, error } = useQuery(GET_CATEGORIES);
    return { categoriesData, error, loading };
}
