import React, { } from "react";
import { StateOption } from "../../../../helpers/useFilterState";
import { Stack, Typography } from "@mui/joy";
import DebounceNumberInput from "../../../../helpers/DebounceNumberInput";

export interface AmountLimit {
    low: number | undefined,
    high: number | undefined,
}

interface Props {
    amountLimit: StateOption<AmountLimit>;
};

export const AmountFilter: React.FC<Props> = ({ amountLimit }) => {
    const DEBOUNCE_TIME = 1000;
    const MAX = 100000;

    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    const stringLow = amountLimit.current.low?.toString() || "";
    const setLow = (v) => {
        const num = v == "" ? undefined : Number(v);
        amountLimit.setter({ low: num, high: amountLimit.current.high });
    }

    const stringHigh = amountLimit.current.high?.toString() || "";
    const setHigh = (v) => {
        const num = v == "" ? undefined : Number(v);
        amountLimit.setter({ high: num, low: amountLimit.current.low });
    }

    return (
        <Stack spacing="2px" alignItems="center" direction="row" sx={{ width: 250, paddingLeft: "5px" }}>
            <DebounceNumberInput
                other={{ size: "sm", sx: { width: 90 } }}
                value={stringLow}
                onChange={setLow}
            />
            <Typography level="body-xs" noWrap>≤ Amount ≤</Typography>
            <DebounceNumberInput
                other={{ size: "sm", sx: { width: 90 } }}
                value={stringHigh}
                onChange={setHigh}
            />
        </Stack>
    );

}