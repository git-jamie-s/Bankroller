import React from "react";
import { FormatCAD } from "../../../helpers/Formatter";
import { TransactionType } from "../../../graphql/Types";
import { StateOption } from "../../../helpers/useFilterState";
import { TransactionDescription } from "./TransactionDescription";
import { TransactionCategory } from "./TransactionCategory";

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
    const [active, setActive] = React.useState<string | null>(null);

    const popId = `popover-${index}`;
    const actionItems = [
        {
            content: "Create Rule",
            onAction: () => {
                setActive(null);
                onCreateRule(transaction);
            }
        },
        {
            content: "Schedule",
            onAction: () => {
                setActive(null);
                onScheduleTransaction(transaction);
            }
        }
    ];

    const toggleMenuActive = (id: string) => () => {
        setActive((activeId) => (activeId !== id ? id : null));
    };

    // const menu = transaction.categoryId && (
    //     <Popover
    //         active={popId === active}
    //         preferredAlignment="right"
    //         activator={
    //             <Button
    //                 fullWidth={false}
    //                 size="slim"
    //                 onClick={toggleMenuActive(popId)}
    //                 icon={ChevronDownIcon}
    //                 accessibilityLabel="Account list"
    //             />
    //         }
    //         autofocusTarget="first-node"
    //         onClose={toggleMenuActive(popId)}
    //     >
    //         <ActionList
    //             actionRole="menuitem"
    //             items={actionItems}
    //         />
    //     </Popover>
    // );


    const accountCell = includeAccount && (
        <td>{transaction.account.accountName}</td>
    );
    const balanceCell = includeBalance && (
        <td>{balance}</td>
    );

    const setCategory = ((v) => setTransactionCategory(transaction.id, v));
    return (
        <tr>
            <td></td>
            {accountCell}
            <td>{transaction.date.toString()}</td>
            <td>{transaction.transactionType}</td>
            <td><TransactionDescription transaction={transaction} editing={editingDescription} /></td>
            <td><TransactionCategory currentCategory={transaction.categoryId} setTransactionCategory={setCategory} /></td>
            <td>{amount}</td>
            {balanceCell}
        </tr>
    )

};