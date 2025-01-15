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