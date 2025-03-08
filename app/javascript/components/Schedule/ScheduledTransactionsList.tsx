import React, { useEffect, useState } from "react";
import { StateOption, useFilterState } from "../../helpers/useFilterState";
import { ScheduledTransactionType } from "../../graphql/Types";
import { ScheduledTransactionRow } from "./ScheduledTransactionRow";
import { GMUpdateScheduledTransaction } from "../../graphql/GMUpdateScheduledTransaction";
import { CircularProgress, Snackbar, Table } from "@mui/joy";
import SortTableHead from "../../helpers/SortTableHead";

interface Props {
    loading?: boolean;
    sorting: StateOption<string>;
    scheduledTransactionArray: any[];
}

export const ScheduledTransactionsList: React.FC<Props> = ({ loading, sorting, scheduledTransactionArray }) => {
    const desc = sorting.current.includes(" desc");
    const sortCol = sorting.current.split(" ")[0];

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
            updateScheduledTransaction({
                variables: {
                    id: st.id,
                    minAmount: st.minAmount,
                    maxAmount: st.maxAmount
                }
            })
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

    const headings = [
        { id: "buttons", label: "", nosort: true },
        { id: 'description', label: "Description" },
        { id: 'type', label: "Transaction Type" },
        { id: 'min_amount', label: "Min amount" },
        { id: 'max_amount', label: "Max amount" },
        { id: 'account.account_name', label: "Account" },
        { id: 'schedule', label: "Schedule", nosort: true },
        { id: 'w_a', label: "Weekend Adjust", nosort: true },
        { id: 'startDate', label: "Start Date", nosort: true },
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
        <Snackbar open={true}
            onClose={() => { setToastMessage(null) }}
            autoHideDuration={2000}>
            {toastMessage}
        </Snackbar>
    ) : null;

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Table
                stickyHeader
            >
                <SortTableHead
                    headCells={headings}
                    onRequestSort={handleSortClick}
                    order={desc ? "desc" : "asc"}
                    orderBy={sortCol}
                />
                <tbody>
                    {rowMarkup}
                </tbody>
            </Table >
            {toastMarkup}
        </>
    );
};

