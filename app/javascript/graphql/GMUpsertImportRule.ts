
import { useMutation, gql } from '@apollo/client';

export function GMUpsertImportRule() {

    const UPSERT_IMPORT_RULE = gql`
    mutation UpsertImportRule($importRule: ImportRuleInput!, $apply: Boolean!) {
        upsertImportRule(input: {importRule: $importRule, apply: $apply}) {
            ok
        }
    }`;
    return useMutation(UPSERT_IMPORT_RULE,
        {
            refetchQueries: [
                'GetImportRules',
                'GetTransactions'
            ]
        }
    );
}
