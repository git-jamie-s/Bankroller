import React, { useState } from "react";
import { StateOption } from "../../../../helpers/useFilterState";
import { PeriodEnum, TransactionType, WeekendAdjustEnum } from "../../../../graphql/Types";
import { FormatAmountString, FormatCAD, WeekdayName } from "../../../../helpers/Formatter";
import { Button, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack, Typography } from "@mui/joy";

interface Props {
    transaction: StateOption<TransactionType | null>;
    onClose: () => void;
    onSave: (transactionId: string, period: PeriodEnum, weekend: WeekendAdjustEnum) => void;
    title?: string | undefined;
}

export const ScheduleTransactionDialog: React.FC<Props> = ({ transaction, onSave, onClose, title = "Schedule Transaction" }) => {

    const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.Weekly);
    const [weekend, setWeekend] = useState<WeekendAdjustEnum>(WeekendAdjustEnum.None);

    if (transaction.current === null) {
        return null;
    }

    const tx = transaction.current;
    const curAutoAmount = (tx.amount) / 100.0;
    const strAmount = curAutoAmount === 0 ? "" : curAutoAmount.toFixed(2);

    const periodOptions = [
        { label: "Weekly", value: PeriodEnum.Weekly },
        { label: "Two weeks", value: PeriodEnum.TwoWeeks },
        { label: "Monthly", value: PeriodEnum.Monthly },
        { label: "Twice Monthly", value: PeriodEnum.TwiceMonthly },
        { label: "Yearly", value: PeriodEnum.Yearly },
    ];

    const weekendOptions = [
        { label: "None", value: WeekendAdjustEnum.None },
        { label: "Before", value: WeekendAdjustEnum.Before },
        { label: "After", value: WeekendAdjustEnum.After },
        { label: "Closest", value: WeekendAdjustEnum.Closest },
    ];

    const onClickSave = () => {
        onSave(tx.id, period, weekend);
    }

    const startDate: string = tx.date.toString() + " " + WeekdayName(tx.date);

    return <>
        <Modal open={true} title={title} onClose={onClose}>
            <ModalDialog>
                <ModalClose />
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input value={tx.description} disabled variant="plain" />
                </FormControl>
                <FormControl>
                    <FormLabel>Transaction Type</FormLabel>
                    <Input value={tx.transactionType} disabled variant="plain" />
                </FormControl>
                <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Input value={FormatAmountString(tx.amount)} disabled variant="plain" />
                </FormControl>
                <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input value={startDate} disabled variant="plain" />
                </FormControl>
                <FormControl>
                    <FormLabel>Period</FormLabel>
                    {/* <Select label="" options={periodOptions} value={period} onChange={(v) => setPeriod(v as PeriodEnum)} /> */}
                </FormControl>
                <FormControl>
                    <FormLabel>Weekend Adjust</FormLabel>
                    {/* <Select label="" options={weekendOptions} value={weekend} onChange={(v) => setWeekend(v as WeekendAdjustEnum)} /></td> */}
                </FormControl>
                <Stack direction="row" spacing="2px" justifyContent="center">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button color="primary" onClick={onClickSave}>Save</Button>
                </Stack>
            </ModalDialog>

        </Modal >
    </>;
};
