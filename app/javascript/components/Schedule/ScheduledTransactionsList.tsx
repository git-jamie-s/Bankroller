import React, { useEffect, useState } from "react";
import { Button, Frame, Icon, IndexTable, SkeletonPage, Toast } from "@shopify/polaris";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { ArrowUpIcon, ArrowDownIcon, ButtonIcon } from '@shopify/polaris-icons';
import { StateOption, useFilterState } from "../../helpers/useFilterState";
import { ScheduledTransactionType } from "../../graphql/Types";
import { ScheduledTransactionRow } from "./ScheduledTransactionRow";
import { GMUpdateScheduledTransaction } from "../../graphql/GMUpdateScheduledTransaction";

interface Props {
    loading?: boolean;
    sorting: StateOption<string>;
    scheduledTransactionArray: any[];
}

export const ScheduledTransactionsList: React.FC<Props> = ({ loading, sorting, scheduledTransactionArray }) => {
    const desc = sorting.current.includes(" desc");
    const array = scheduledTransactionArray;

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                console.log("Escape");
                editinMinAmount.setter(null);
                editinMaxAmount.setter(null);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const [updateScheduledTransaction] = GMUpdateScheduledTransaction();

    const onChange = (st) => {
        console.log("Updated: ", st);
        if (st != null) {
            const input = {
                id: st.id,
                minAmount: st.minAmount,
                maxAmount: st.maxAmount
            };
            updateScheduledTransaction({ variables: { scheduledTransaction: input } })
                .then(() => { setToastMessage("Saved") });
        }
    }

    const editinMinAmount = useFilterState<ScheduledTransactionType | null>(null, onChange);
    const editinMaxAmount = useFilterState<ScheduledTransactionType | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleSortClick = (sortVal) => {
        const sameCol = sorting.current.startsWith(sortVal);

        const newDesc = sameCol == desc ? "asc" : "desc";
        const newSortVal = `${sortVal} ${newDesc}, id ${newDesc}`;
        sorting.setter(newSortVal);
    }

    const dirIcon = desc ? ArrowDownIcon : ArrowUpIcon;
    function titleButton(label: string, sortVal: string) {
        const icon = (sorting.current.startsWith(sortVal)) ? dirIcon : undefined;
        return <Button variant="tertiary"
            fullWidth
            textAlign="left"
            icon={icon}
            onClick={() => handleSortClick(sortVal)}>{label}
        </Button>;
    }

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: "buttons", title: <Icon source={ButtonIcon} /> },
        { id: 'description', title: titleButton("Description", "description") },
        { id: 'type', title: titleButton("Transaction Type", "transaction_type") },
        { id: 'minAmount', title: titleButton("Min amount", "min_amount") },
        { id: 'maxAmount', title: titleButton("Max amount", "max_amount") },
        { id: 'account', title: titleButton("Account", "account.account_name") },
        { id: 'schedule', title: "Schedule" },
        { id: 'w_a', title: "Weekend Adjust" },
        { id: 'startDate', title: "Start Date" },
    ];

    const rowMarkup = array.map(
        (scheduledTransaction, index) => {
            return <ScheduledTransactionRow
                index={index}
                scheduledTransaction={scheduledTransaction}
                setToastMessage={setToastMessage}
                editingMaxAmount={editinMaxAmount}
                editingMinAmount={editinMinAmount}
            />
        }
    );

    const toastMarkup = toastMessage ? (
        <Toast content={toastMessage} onDismiss={() => { setToastMessage(null) }} duration={2000} />
    ) : null;

    if (loading) {
        return <SkeletonPage />;
    }

    return (
        <Frame>
            <IndexTable
                headings={headings}
                itemCount={array.length}
                selectable={false}
                hasZebraStriping
            >
                {rowMarkup}
            </IndexTable>
            {toastMarkup}
        </Frame>
    );
};

