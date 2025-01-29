
import { useQuery, gql } from '@apollo/client';
import { AccountType } from './Types';

export function GQAccount(accountId) {

    const GET_ACCOUNT = gql`
    query GetAccount($id: ID!) {
        account(id: $id) {
            id
            accountName
            created
            balance
        }
    }`;
    const id = Number(accountId);
    const { data: accountData, loading, error } = useQuery(GET_ACCOUNT, { variables: { id } });

    return { accountData, error, loading };
}
