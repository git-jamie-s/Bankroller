import { useQuery, gql } from '@apollo/client';

export function GQTransactionTypes() {

    const GET_TRANSACTION_TYPES = gql`
    query GetTransactionTypes {
        transactionTypes 
    }`;
    const { data: transactionTypeData, loading, error } = useQuery(GET_TRANSACTION_TYPES);
    return { transactionTypeData, error, loading };
}
