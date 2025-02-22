import React, { ReactElement } from "react";
import { Text } from "@shopify/polaris";
import { CategoryType, PeriodEnum } from "../graphql/Types";

export function FormatCAD(pennies: number): ReactElement {
    const CAD = new Intl.NumberFormat('en-CA', { style: "currency", currency: "CAD" });

    const str = CAD.format(Math.abs(pennies) / 100);
    if (pennies < 0) {
        return (<Text as="p" tone="critical">({str})</Text>);
    }
    else {
        return (<Text as="p" tone="success">{str}</Text>);
    }
}

export function FormatAmountString(pennies: number): string {
    const dolls = (pennies / 100.0).toFixed(2);
    return dolls;
}

export function WeekdayName(d: Date): string {
    const dd = new Date(d);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[dd.getDay()];
}

export function annualBudget(category: CategoryType): number {
    const ba = category.budgetAmount || 0;
    switch (category.budgetPeriod) {
        case PeriodEnum.Yearly:
            return ba;
        case PeriodEnum.Monthly:
            return ba * 12;
        case PeriodEnum.Weekly:
            return ba * 52;
        case PeriodEnum.TwoWeeks:
            return ba * 26;
        case PeriodEnum.TwiceMonthly:
            return ba * 24;
    }
    return 0;
}
