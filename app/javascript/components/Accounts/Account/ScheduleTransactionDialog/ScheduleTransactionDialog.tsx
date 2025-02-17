import React, { useState } from "react";
import { Card, Modal, Button, InlineStack, BlockStack, Select } from '@shopify/polaris';
import { StateOption } from "../../../../helpers/useFilterState";
import { PeriodEnum, TransactionType, WeekendAdjustEnum } from "../../../../graphql/Types";
import { FormatCAD, WeekdayName } from "../../../../helpers/Formatter";

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

    return <Modal open={true} title={title} onClose={onClose}>
        <Card>
            <BlockStack align="center">
                <table>
                    <tr>
                        <td>Description</td>
                        <td>{tx.description}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{tx.transactionType}</td>
                    </tr>
                    <tr>
                        <td>Amount</td>
                        <td>{FormatCAD(tx.amount)}</td>
                    </tr>
                    <tr>
                        <td>Start Date</td>
                        <td>{tx.date.toString()} ({WeekdayName(tx.date)})</td>
                    </tr>
                    <tr>
                        <td>Period</td>
                        <td>
                            <Select label="" options={periodOptions} value={period} onChange={(v) => setPeriod(v as PeriodEnum)} />
                        </td>
                    </tr>
                    <tr>
                        <td>Weekend Adjust</td>
                        <td><Select label="" options={weekendOptions} value={weekend} onChange={(v) => setWeekend(v as WeekendAdjustEnum)} /></td>
                    </tr>
                </table>
            </BlockStack>
        </Card>
        <Card>
            <InlineStack align="center" gap="025">
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onClickSave}>Save</Button>
            </InlineStack>
        </Card>
    </Modal >;
};
