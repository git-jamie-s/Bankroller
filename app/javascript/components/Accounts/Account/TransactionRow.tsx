import React from "react";
import { FormatCAD } from "../../../helpers/Formatter";
import { TransactionType } from "../../../graphql/Types";
import { StateOption } from "../../../helpers/useFilterState";
import { TransactionDescription } from "./TransactionDescription";
import { TransactionCategory } from "./TransactionCategory";
import { AutoFixHigh, Schedule } from '@mui/icons-material';
import { Stack, IconButton, MenuButton, Dropdown, Menu, MenuItem, ListItemDecorator } from "@mui/joy";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    index: number;
    transaction: TransactionType;
    includeAccount: boolean;
    includeBalance: boolean;
    editingDescription: StateOption<TransactionType | null>;
    setTransactionCategory: (id, category) => void;
    onCreateRule: (transaction) => void;
    onScheduleTransaction: (transaction) => void;
};

export const TransactionRow: React.FC<Props> = ({ index,
    transaction,
    includeAccount,
    includeBalance,
    editingDescription,
    setTransactionCategory,
    onCreateRule,
    onScheduleTransaction }) => {
    const amount = FormatCAD(transaction.amount);
    const balance = FormatCAD(transaction.balance);

    const dropdown = <Dropdown>
        <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
        >
            <ExpandMoreIcon />
        </MenuButton>
        <Menu>
            <MenuItem onClick={() => onCreateRule(transaction)}>
                <ListItemDecorator><AutoFixHigh /></ListItemDecorator>
                Create Import Rule
            </MenuItem>
            <MenuItem onClick={() => onScheduleTransaction(transaction)}>
                <ListItemDecorator><Schedule /></ListItemDecorator>
                Schedule Transation
            </MenuItem>
        </Menu>
    </Dropdown>;

    const accountCell = includeAccount && (
        <td>{transaction.account.accountName}</td>
    );
    const balanceCell = includeBalance && (
        <td>{balance}</td>
    );

    const actions = <Stack direction="row">
        <IconButton><AutoFixHigh /></IconButton>
        <IconButton><Schedule /></IconButton>
    </Stack>

    const setCategory = ((v) => setTransactionCategory(transaction.id, v));
    return (
        <tr>
            <td>{dropdown}</td>
            {accountCell}
            <td>{transaction.date.toString()}</td>
            <td>{transaction.transactionType}</td>
            <td><TransactionDescription transaction={transaction} editing={editingDescription} /></td>
            <td><TransactionCategory freeSolo currentCategory={transaction.categoryId} setTransactionCategory={setCategory} /></td>
            <td>{amount}</td>
            {balanceCell}
        </tr>
    )

};