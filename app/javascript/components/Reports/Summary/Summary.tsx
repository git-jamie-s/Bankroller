import React from "react";
import { GQAnnualSummary } from "../../../graphql/GQAnnualSummary";
import { SummaryOverviewTable } from "./SummaryOverviewTable";
import { ExpensesSummaryTable } from "./ExpensesSummaryTable";
import { useFilterState } from "../../../helpers/useFilterState";
import { Card, CircularProgress } from "@mui/joy";

export const Summary: React.FC = () => {
    // What is the current year?
    const currentYear = new Date().getFullYear();

    const year = useFilterState<number>(currentYear);

    const { loading, error, annualSummary } = GQAnnualSummary(year.current);

    if (loading) {
        return <CircularProgress />;
    }
    if (error) {
        return null;
    }

    return (
        <Card>
            <Card title="Overview">
                <SummaryOverviewTable summary={annualSummary} year={year} />
            </Card>
            <Card>
                <ExpensesSummaryTable summary={annualSummary} />
            </Card>
        </Card>
    );
};

export default Summary;