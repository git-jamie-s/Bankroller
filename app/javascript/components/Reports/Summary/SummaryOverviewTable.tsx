import React, { useState } from "react";
import { Card, Text, Spinner, InlineStack, TextField, ColumnContentType, IndexTable, DataTable, Grid } from "@shopify/polaris";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { FormatCAD } from "../../../helpers/Formatter";
import SummaryBarChart from "./SummaryBarChart";

interface Props {
    summary: any
}


export const SummaryOverviewTable: React.FC<Props> = ({ summary }) => {

    const headings = [];

    const consummage = (-100 * summary.totalSpent / summary.totalBudget).toFixed(0);
    const rows = [
        ["Report Year", summary.reportYear],
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
