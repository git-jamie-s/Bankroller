import React, { useRef } from "react";
import { FormatCAD } from "../../../helpers/Formatter";
import SummaryBarChart from "./SummaryBarChart";
import { StateOption } from "../../../helpers/useFilterState";
import debounce from "lodash.debounce";
import { Input, Stack, Table, TextField } from "@mui/joy";

interface Props {
    summary: any,
    year: StateOption<number>
}
const DEBOUNCE_TIME = 500;

export const SummaryOverviewTable: React.FC<Props> = ({ summary, year }) => {

    const headings = [];
    const [localYear, setLocalYear] = React.useState<number>(year.current);

    const consummage = (-100 * summary.totalSpent / summary.totalBudget).toFixed(0);

    const debouncedSetYear = useRef<any>(
        debounce((nextValue) => { year.setter(nextValue) }, DEBOUNCE_TIME)
    ).current;

    const setLocalYearDebounce = (event) => {
        const v = event.target.value;
        setLocalYear(Number(v));
        debouncedSetYear(Number(v));
    };

    const yearInput =
        <Input type="number" value={localYear} onChange={setLocalYearDebounce} />;

    const rows = [
        ["Report Year", yearInput],
        ["Annual Budget", FormatCAD(summary.totalBudget)],
        ["Expenses", FormatCAD(summary.totalSpent)],
        ["Annual Budget Consumed", `${consummage}%`]
    ]
    if (summary.yearPortion != 1) {
        rows.push(["Year Percentage", (summary.yearPortion * 100).toFixed(2) + "%"]);
    }

    return (
        <Stack direction="row">
            <Table>
                <tbody>
                    {rows.map((row) => <tr><td>{row[0]}</td><td>{row[1]}</td></tr>)}
                </tbody>
            </Table>
            <SummaryBarChart summary={summary} />
        </Stack>
    );
};
