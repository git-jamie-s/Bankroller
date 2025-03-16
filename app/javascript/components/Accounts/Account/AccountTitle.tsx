import React, { useState } from "react";
import { AccountType } from "../../../graphql/Types";
import { Button, Stack, Typography } from "@mui/joy";
import DebounceInput from "../../../helpers/DebounceInput";
import EditIcon from '@mui/icons-material/Edit';
import { GMUpdateAccountName } from "../../../graphql/GMAccountName";
interface Props {
    account: AccountType;
}

const AccountTitle: React.FC<Props> = ({ account }) => {

    const [editing, setEditing] = useState<boolean>(false);

    const [updateAccountName, { data: updateData, error: updateError }] = GMUpdateAccountName();

    const onSetAccountName = (v) => {
        updateAccountName({
            variables: {
                accountId: account.id,
                accountName: v
            }
        }).then(() => { setEditing(false) });
    }

    const control = editing ?
        <DebounceInput
            onChange={onSetAccountName}
            value={account.accountName}
            debounceTimeout={2000}
            other={{
                autoFocus: true
            }} /> :
        <Button
            variant="plain"
            endDecorator={<EditIcon />}
            onClick={() => setEditing(true)}
        >
            {account.accountName}
        </Button>;

    return <Stack direction="row" alignItems="center">

        <Typography level="title-lg">Account: </Typography>
        {control}
    </Stack>
};

export default AccountTitle;