
import { useMutation, gql } from '@apollo/client';

export function GMCreateScheduledTransaction() {

    const CREATE_SCHEDULED_TRANSACTION = gql`
    mutation CreateScheduledTransaction($transactionId: ID!, $period: PeriodEnum!, $weekendAdjust: WeekendAdjustEnum!) {
        createScheduledTransaction(input: {transactionId: $transactionId, period: $period, weekendAdjust: $weekendAdjust}) {
            ok
        }
    }`;
    return useMutation(CREATE_SCHEDULED_TRANSACTION,
        {
            refetchQueries: [
                'GetScheduledTransactions'
            ]
        }
    );
}
