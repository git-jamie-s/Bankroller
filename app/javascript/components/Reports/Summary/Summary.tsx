import React, { useState } from "react";
import { Card, Text, Spinner, ResourceList, ResourceItem, InlineStack, Icon, Button, TextField, Toast, Frame, DataTable, ColumnContentType } from "@shopify/polaris";
import { BookOpenIcon } from "@shopify/polaris-icons";
import { GQAnnualSummary } from "../../../graphql/GQAnnualSummary";
import { FormatCAD } from "../../../helpers/Formatter";
import { buildASTSchema } from "graphql";

export const Summary: React.FC = () => {
    const { loading, error, annualSummary } = GQAnnualSummary(undefined);

    if (loading) {
        return <Spinner />;
    }
    if (error) {
        return null;
    }

    const headings = [
        "Category",
        "YTD Actual",
        "YTD Budget",
        "YTD Variance",
    ];

    const colTypes = [
        "text",
        "numeric",
        "numeric",
        "numeric",
    ] as ColumnContentType[];

    const rows = annualSummary.expenses.map((cat) => {
        const yearBudgetPortion = cat.annualBudget * annualSummary.yearPortion;
        const yearSpentPortion = cat.spent / yearBudgetPortion * 100.0;
        return [
            cat.category,
            FormatCAD(-1 * cat.spent),
            FormatCAD(yearBudgetPortion),
            FormatCAD(yearBudgetPortion + cat.spent),
        ];
    });


    return (
        <Card>
            <Text as="span">Annual Summary: {(annualSummary.yearPortion * 100).toFixed(2)}%</Text>

            <DataTable
                columnContentTypes={colTypes}
                headings={headings}
                rows={rows}
            >
            </DataTable>

        </Card>
    );
};

export default Summary;