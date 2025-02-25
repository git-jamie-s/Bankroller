import React from "react";
import { FormatCAD } from "../../../helpers/Formatter";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTable } from "@shopify/polaris";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";

interface Props {
    summary: any
}


export const ExpensesSummaryTable: React.FC<Props> = ({ summary }) => {

    const entireYear = summary.yearPortion == 1;

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: 'category', title: "Category" },
        { id: 'ytdactual', title: entireYear ? "Actual" : "YTD Actual" },
        { id: 'ytdbudget', title: entireYear ? "Budget" : "YTD Budget" },
        { id: 'ytdvariance', title: entireYear ? "Variance" : "YTD Variance" },
    ];

    const rows = summary.expenses.map((cat, index) => {
        const yearBudgetPortion = cat.annualBudget * summary.yearPortion;
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

    return <IndexTable
        headings={headings}
        resourceName={{ singular: "", plural: "" }}
        selectable={false}
        hasZebraStriping
        itemCount={summary.expenses.length}
    >
        {rows}
    </IndexTable>
};

