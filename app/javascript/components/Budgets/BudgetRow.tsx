import React from "react";
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
        <tr onClick={() => selectRow(category.id)}>
            <td>{category.id}</td>
            <td>
                <BudgetPeriod category={category} />
            </td>
            <td>
                <BudgetAmount category={category} editing={editingAmount} />
            </td>
            <td>{FormatCAD(annual)}</td>
        </tr>
    );
};
