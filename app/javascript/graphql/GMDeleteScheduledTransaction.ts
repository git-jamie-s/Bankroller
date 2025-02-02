
import { useMutation, gql } from '@apollo/client';

export function GMDeleteScheduledTransaction() {

    const DELETE_SCHEDULED_TRANSACTION = gql`
    mutation DeleteScheduledTransaction($id: ID!) {
        deleteScheduledTransaction(input: {id: $id}) {
            ok
        }
    }`;
    return useMutation(DELETE_SCHEDULED_TRANSACTION,
        {
            refetchQueries: [
                'GetScheduledTransactions'
            ]
        }
    );
}
