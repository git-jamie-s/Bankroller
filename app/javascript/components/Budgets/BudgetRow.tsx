import React from "react";
import { IndexTable } from "@shopify/polaris";
import { annualBudget, FormatCAD } from "../../helpers/Formatter";
import { CategoryType } from "../../graphql/Types";
import { StateOption } from "../../helpers/useFilterState";
import { BudgetPeriod } from "./BudgetPeriod";
import { BudgetAmount } from "./BudgetAmount";

export interface Props {
    category: CategoryType;
    index: number;
    editingAmount: StateOption<CategoryType | null>;
    selectRow: (id: string) => void;
}

export const BudgetRow: React.FC<Props> = ({ category, index, editingAmount, selectRow }) => {
    const annual = annualBudget(category);

    return (
        <IndexTable.Row id={category.id} key={category.id} position={index} onClick={() => selectRow(category.id)}>
            <IndexTable.Cell>{category.id}</IndexTable.Cell>
            <IndexTable.Cell>
                <BudgetPeriod category={category} />
            </IndexTable.Cell>
            <IndexTable.Cell>
                <BudgetAmount category={category} editing={editingAmount} />
            </IndexTable.Cell>
            <IndexTable.Cell>{FormatCAD(annual)}</IndexTable.Cell>
        </IndexTable.Row>
    );
};
