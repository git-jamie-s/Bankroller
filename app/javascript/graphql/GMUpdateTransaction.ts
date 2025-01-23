
import { useMutation, gql } from '@apollo/client';

export function GMUpdateTransaction() {

    const UPDATE_TRANSACTION = gql`
    mutation UpdateTransaction($transaction: TransactionInput!) {
        updateTransaction(input: {transaction: $transaction}) {
            ok
        }
    }`;
    return useMutation(UPDATE_TRANSACTION,
        {
            refetchQueries: [
                'GetTransactions'
            ]
        }
    );
}
