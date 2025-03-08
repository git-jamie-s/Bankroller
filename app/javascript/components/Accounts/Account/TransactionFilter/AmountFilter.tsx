import React, { useRef, useState } from "react";
import { StateOption } from "../../../../helpers/useFilterState";
import debounce from "lodash.debounce";
import { Checkbox, Input, Stack } from "@mui/joy";

export interface AmountLimit {
    low: number | undefined,
    high: number | undefined,
    abs: boolean;
}

interface Props {
    amountLimit: StateOption<AmountLimit>;
};

export const AmountFilter: React.FC<Props> = ({ amountLimit }) => {
    const DEBOUNCE_TIME = 1000;

    const [locals, setLocals] = useState<AmountLimit>(amountLimit.current);

    const debouncedOnQueryChange = useRef<any>(
        debounce((nextValue) => {
            if (nextValue.low && nextValue.high && nextValue.low > nextValue.high) {
                const al = { low: nextValue.high, high: nextValue.low, abs: nextValue.abs }
                setLocals(al);
                amountLimit.setter(al);
            }
            else {
                amountLimit.setter(nextValue);
            }
        },
            DEBOUNCE_TIME)
    ).current;

    const setLocalLowDebounce = (event) => {
        const val = event.target.value;
        const low = val === "" ? undefined : parseInt(val);
        const al = { ...locals, low };
        setLocals(al);
        debouncedOnQueryChange(al);
    }

    const setLocalHighDebounce = (val) => {
        const high = val === "" ? undefined : parseInt(val);
        const al = { ...locals, high };
        setLocals(al);
        debouncedOnQueryChange(al);
    }

    const changeAbs = (checked) => {
        const al = { ...amountLimit.current, abs: checked };
        setLocals(al);
        debouncedOnQueryChange(al);
    }

    const localLow = locals.low?.toString() || "";
    const localHigh = locals.high?.toString() || "";

    return (
        <Stack direction="row" sx={{ alignItems: "center" }}>
            <span>&nbsp;Amount:</span>
            <Input
                sx={{ maxWidth: "10em" }}
                size="sm"
                type="number"
                value={localLow}
                onChange={setLocalLowDebounce}
                placeholder="Low"
            />
            <Input
                sx={{ maxWidth: "10em" }}
                size="sm"
                type="number"
                value={localHigh}
                onChange={setLocalHighDebounce}
                placeholder="High"
            />
            <Checkbox label="ABS" checked={locals.abs} onChange={changeAbs} />
        </Stack>
    );

}