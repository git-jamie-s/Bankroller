
import { useMutation, gql } from '@apollo/client';

export function GMUpsertAutoTransaction() {

    const UPSERT_AUTO_TRANSACTION = gql`
    mutation UpsertAutoTransaction($autoTransaction: AutoTransactionInput!, $apply: Boolean!) {
        upsertAutoTransaction(input: {autoTransaction: $autoTransaction, apply: $apply}) {
            ok
        }
    }`;
    return useMutation(UPSERT_AUTO_TRANSACTION,
        {
            refetchQueries: [
                'GetAutoTransactions'
            ]
        }
    );
}
