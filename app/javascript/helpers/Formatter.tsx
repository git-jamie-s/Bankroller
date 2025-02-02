import React, { ReactElement } from "react";
import { Text } from "@shopify/polaris";

export function FormatCAD(pennies: number): ReactElement {
    const CAD = new Intl.NumberFormat('en-CA', { style: "currency", currency: "CAD" });

    const str = CAD.format(pennies / 100);
    if (pennies < 0) {
        return (<Text as="p" tone="critical">{str}</Text>);
    }
    else {
        return (<Text as="p" tone="success">{str}</Text>);
    }
}

export function FormatAmountString(pennies: number): string {
    const dolls = (pennies / 100.0).toFixed(2);
    return dolls;
}