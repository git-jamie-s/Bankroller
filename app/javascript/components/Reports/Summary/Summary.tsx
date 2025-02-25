import React, { useState } from "react";
import { Card, Text, Spinner, InlineStack, TextField, ColumnContentType, IndexTable } from "@shopify/polaris";
import { GQAnnualSummary } from "../../../graphql/GQAnnualSummary";
import { FormatCAD } from "../../../helpers/Formatter";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { SummaryOverviewTable } from "./SummaryOverviewTable";

export const Summary: React.FC = () => {
    // What is the current year?
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<number>(currentYear);

    const { loading, error, annualSummary } = GQAnnualSummary(year);

    if (loading) {
        return <Spinner />;
    }
    if (error) {
        return null;
    }

    const entireYear = annualSummary.yearPortion == 1;

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: 'category', title: "Category" },
        { id: 'ytdactual', title: entireYear ? "Actual" : "YTD Actual" },
        { id: 'ytdbudget', title: entireYear ? "Budget" : "YTD Budget" },
        { id: 'ytdvariance', title: entireYear ? "Variance" : "YTD Variance" },
    ];

    const colTypes = [
        "text",
        "numeric",
        "numeric",
        "numeric",
    ] as ColumnContentType[];

    const rows = annualSummary.expenses.map((cat, index) => {
        const yearBudgetPortion = cat.annualBudget * annualSummary.yearPortion;
        const yearSpentPortion = cat.spent / yearBudgetPortion * 100.0;
        return [
            <IndexTable.Row id={cat.id} key={cat.id} position={index}>
                <IndexTable.Cell>{cat.category}</IndexTable.Cell>
                <IndexTable.Cell>{FormatCAD(-1 * cat.spent)}</IndexTable.Cell>
                <IndexTable.Cell>{FormatCAD(yearBudgetPortion)}</IndexTable.Cell>
                <IndexTable.Cell>{FormatCAD(yearBudgetPortion + cat.spent)}</IndexTable.Cell>
            </IndexTable.Row>
        ];
    });
    const yearCompletion = year == currentYear && (<Text as="span">&nbsp;Completion: {(annualSummary.yearPortion * 100).toFixed(2)}%</Text>);

    return (
        <Card>
            <Card>
                <InlineStack>
                    <Text as="span">Annual Summary for: &nbsp;</Text>
                    <TextField size="slim" autoComplete="off" label="" type="number" value={year.toString()} onChange={(v) => setYear(Number(v))} />
                    {yearCompletion}
                </InlineStack>
            </Card>
            <Card>
                <SummaryOverviewTable summary={annualSummary} />
            </Card>
            <Card>
                <IndexTable
                    headings={headings}
                    resourceName={{ singular: "", plural: "" }}
                    selectable={false}
                    hasZebraStriping
                    itemCount={annualSummary.expenses.length}
                >
                    {rows}
                </IndexTable>
            </Card>
        </Card>
    );
};

export default Summary;