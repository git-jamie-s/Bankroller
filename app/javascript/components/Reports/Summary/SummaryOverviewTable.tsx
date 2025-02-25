import React from "react";
import { DataTable, Grid, TextField } from "@shopify/polaris";
import { FormatCAD } from "../../../helpers/Formatter";
import SummaryBarChart from "./SummaryBarChart";
import { StateOption } from "../../../helpers/useFilterState";

interface Props {
    summary: any,
    year: StateOption<number>
}

export const SummaryOverviewTable: React.FC<Props> = ({ summary, year }) => {

    const headings = [];

    const consummage = (-100 * summary.totalSpent / summary.totalBudget).toFixed(0);
    const yearInput =
        <div style={{ textAlign: "right" }}>
            <div style={{ maxWidth: 200, float: "right" }}>
                <TextField
                    maxLength={4}
                    align="right"
                    label=""
                    autoComplete="off"
                    value={year.current.toString()}
                    type="number"
                    onChange={(v) => year.setter(Number(v))}
                    size="slim"
                    autoSize />
            </div>
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
