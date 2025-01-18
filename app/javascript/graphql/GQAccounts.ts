
import { useQuery, gql } from '@apollo/client';

export function GQAccounts() {

    const GET_ACCOUNTS = gql`
    query GetAccounts {
        accounts {
            id
            accountName
            created
            balance
        }
    }`;
    const { data: accountsData, loading, error } = useQuery(GET_ACCOUNTS);
    return { accountsData, error, loading };
}
