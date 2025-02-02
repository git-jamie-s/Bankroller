
import { useMutation, gql } from '@apollo/client';

export function GMDeleteImportRule() {

    const DELETE_IMPORT_RULE = gql`
    mutation DeleteImportRule($id: ID!) {
        deleteImportRule(input: {id: $id}) {
            ok
        }
    }`;
    return useMutation(DELETE_IMPORT_RULE,
        {
            refetchQueries: [
                'GetImportRules'
            ]
        }
    );
}
