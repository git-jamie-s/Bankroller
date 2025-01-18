
import { useMutation, gql } from '@apollo/client';

export function GMDeleteAutoTransaction() {

    const DELETE_AUTO_TRANSACTION = gql`
    mutation DeleteAutoTransaction($id: ID!) {
        deleteAutoTransaction(input: {id: $id}) {
            ok
        }
    }`;
    return useMutation(DELETE_AUTO_TRANSACTION,
        {
            refetchQueries: [
                'GetAutoTransactions'
            ]
        }
    );
}
