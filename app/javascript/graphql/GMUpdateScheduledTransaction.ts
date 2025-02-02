
import { useMutation, gql } from '@apollo/client';

export function GMUpdateScheduledTransaction() {

    const UPDATE_SCHEDULED_TRANSACTION = gql`
    mutation UpdateScheduledTransaction($scheduledTransaction: ScheduledTransactionInput!) {
        updateScheduledTransaction(input: {scheduledTransaction: $scheduledTransaction}) {
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
