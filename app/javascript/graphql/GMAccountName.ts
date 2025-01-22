
import { useMutation, gql } from '@apollo/client';

export function GMUpdateAccountName() {

    const UPDATE_ACCOUNT_NAME = gql`
    mutation UpdateAccountName($accountId: ID!, $accountName: String!) {
        updateAccountName(input: {accountId: $accountId, accountName: $accountName}) {
            ok
        }
    }`;
    return useMutation(UPDATE_ACCOUNT_NAME,
        {
            refetchQueries: [
                'GetAccounts',
                'GetAccount'
            ]
        }
    );
}
