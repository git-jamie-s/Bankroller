import React, { useState } from "react";
import { Card, Text, Spinner, InlineStack, TextField } from "@shopify/polaris";
import { GQAnnualSummary } from "../../../graphql/GQAnnualSummary";
import { SummaryOverviewTable } from "./SummaryOverviewTable";
import { ExpensesSummaryTable } from "./ExpensesSummaryTable";
import { StateOption, useFilterState } from "../../../helpers/useFilterState";

export const Summary: React.FC = () => {
    // What is the current year?
    const currentYear = new Date().getFullYear();

    const year = useFilterState<number>(currentYear);

    const { loading, error, annualSummary } = GQAnnualSummary(year.current);

    if (loading) {
        return <Spinner />;
    }
    if (error) {
        return null;
    }

    const yearCompletion = year.current == currentYear && (<Text as="span">&nbsp;Completion: {(annualSummary.yearPortion * 100).toFixed(2)}%</Text>);

    return (
        <Card>
            <Card>
                <SummaryOverviewTable summary={annualSummary} year={year} />
            </Card>
            <Card>
                <ExpensesSummaryTable summary={annualSummary} />
            </Card>
        </Card>
    );
};

export default Summary;