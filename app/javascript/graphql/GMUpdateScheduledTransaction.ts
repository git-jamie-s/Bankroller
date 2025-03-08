
import { useMutation, gql } from '@apollo/client';

export function GMUpdateScheduledTransaction() {

    const UPDATE_SCHEDULED_TRANSACTION = gql`
    mutation UpdateScheduledTransaction($id: ID!, $minAmount: Int!, $maxAmount: Int) {
        updateScheduledTransaction(input: {id: $id, minAmount: $minAmount, maxAmount: $maxAmount}) {
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
