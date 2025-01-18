
import { useMutation, gql } from '@apollo/client';

export function GMUpdateAutoTransaction() {

    const UPDATE_AUTO_TRANSACTION = gql`
    mutation UpdateAutoTransaction($autoTransaction: AutoTransactionInput!) {
        updateAutoTransaction(input: {autoTransaction: $autoTransaction}) {
            ok
        }
    }`;
    return useMutation(UPDATE_AUTO_TRANSACTION,
        {
            refetchQueries: [
                'GetAutoTransactions'
            ]
        }
    );
}
