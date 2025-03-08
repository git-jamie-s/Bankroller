import React from "react";
import { FormatCAD } from "../../../helpers/Formatter";
import { Table } from "@mui/joy";

interface Props {
    summary: any
}


export const ExpensesSummaryTable: React.FC<Props> = ({ summary }) => {

    const entireYear = summary.yearPortion == 1;

    const headings = [
        "Category",
        entireYear ? "Actual" : "YTD Actual",
        entireYear ? "Budget" : "YTD Budget",
        entireYear ? "Variance" : "YTD Variance",
    ].map((h) => <th>{h}</th>);

    const rows = summary.expenses.map((cat) => {
        const yearBudgetPortion = cat.annualBudget * summary.yearPortion;
        const yearSpentPortion = cat.spent / yearBudgetPortion * 100.0;
        return [
            <tr>
                <td>{cat.category}</td>
                <td>{FormatCAD(-1 * cat.spent)}</td>
                <td>{FormatCAD(yearBudgetPortion)}</td>
                <td>{FormatCAD(yearBudgetPortion + cat.spent)}</td>
            </tr>
        ];
    });

    return <Table size="sm">
        <thead>
            <tr>
                {headings}
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </Table>
};

