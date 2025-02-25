import React, { useRef } from "react";
import { DataTable, Grid, TextField } from "@shopify/polaris";
import { FormatCAD } from "../../../helpers/Formatter";
import SummaryBarChart from "./SummaryBarChart";
import { StateOption } from "../../../helpers/useFilterState";
import debounce from "lodash.debounce";

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

    const setLocalYearDebounce = (v) => {
        setLocalYear(v);
        debouncedSetYear(v);
    };

    const yearInput =
        <div style={{ maxWidth: 150, float: "right" }}>
            <TextField
                maxLength={4}
                align="right"
                label=""
                autoComplete="off"
                value={localYear.toString()}
                type="number"
                onChange={(v) => setLocalYearDebounce(Number(v))}
            />
        </div>;
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
        <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
                <DataTable
                    headings={headings}
                    rows={rows}
                    columnContentTypes={["text", "numeric"]} />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
                <SummaryBarChart summary={summary} />
            </Grid.Cell>
        </Grid>
    );
};
