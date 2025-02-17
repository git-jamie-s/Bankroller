
import { useMutation, gql } from '@apollo/client';

export function GMUpdateScheduledTransaction() {

    const UPDATE_SCHEDULED_TRANSACTION = gql`
    mutation UpdateScheduledTransaction($id: ID!, $minAmount: Integer!, $maxAcount: Integer) {
        updateScheduledTransaction(input: {id: $id, minAmount: $minAmount, maxAcount: $maxAmount}) {
            ok
        }
    }`;
    return useMutation(UPDATE_SCHEDULED_TRANSACTION,
        {
            refetchQueries: [
                'GetScheduledTransactions'
            ]
        }
    );
}
