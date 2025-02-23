
import { useMutation, gql } from '@apollo/client';

export function GMUpdateCategory() {

    const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($category: CategoryInput!) {
        updateCategory(input: {category: $category}) {
            ok
        }
    }`;
    return useMutation(UPDATE_CATEGORY,
        {
            refetchQueries: [
                'GetCategories',
                'GetBudgetHistory'
            ]
        }
    );
}
