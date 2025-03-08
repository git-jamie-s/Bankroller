import React from "react";
import { GQCategories } from "../../graphql/GQCategories";
import { annualBudget } from "../../helpers/Formatter";
import { CategoryType } from "../../graphql/Types";
import { useFilterState } from "../../helpers/useFilterState";
import { BudgetRow } from "./BudgetRow";
import { GMUpdateCategory } from "../../graphql/GMUpdateCategory";
import ChartComponent from "./BudgetChart";
import './BudgetsPage.css';
import { CircularProgress, Stack, Table } from "@mui/joy";
import SortTableHead from "../../helpers/SortTableHead";

export const Budgets: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

    const { categoriesData, loading, error } = GQCategories();
    const [updateCategory] = GMUpdateCategory();

    const sorting = useFilterState<string>("category asc");
    const sortCol = sorting.current.split(" ")[0];
    const desc = sorting.current.includes(" desc");

    const onEditComplete = ((value) => {
        if (value) {
            const sliced = { id: value.id, budgetPeriod: value.budgetPeriod, budgetAmount: value.budgetAmount };
            updateCategory({ variables: { category: sliced } });
        }
    });
    const editingAmount = useFilterState<CategoryType | null>(null, onEditComplete);

    if (loading) return <CircularProgress />;
    if (error) return <p>Error : {error.message}</p>;

    const headings: any[] = [
        { id: 'category', label: "Category" },
        { id: 'period', label: "Budget Period" },
        { id: 'amount', label: "Budget Amount" },
        { id: 'annual', label: "Annual Budget" },
    ];

    const rowMarkup = categoriesData.categories
        .filter((c) => c.id.startsWith("expenses"))
        .sort((a, b) => {
            const flip = desc ? -1 : 1;
            switch (sortCol) {
                case "amount":
                    return (a.budgetAmount - b.budgetAmount) * flip;
                case "annualAmount":
                    return (annualBudget(a) - annualBudget(b)) * flip;
                case "period":
                    return (a.budgetPeriod.localeCompare(b)) * flip;
            };
            return a.id.localeCompare(b.id) * flip;
        })
        .map((c, index) => {
            const annual = annualBudget(c);
            return (<BudgetRow category={c} index={index} editingAmount={editingAmount} selectRow={setSelectedCategory} />);
        }
        );

    return (<>
        <Stack direction="row">
            <Table
                stripe="even"
                size="sm"
                stickyHeader
                stickyFooter
            >
                <SortTableHead
                    onRequestSort={sorting.setter}
                    order={desc ? "desc" : "asc"}
                    orderBy={sortCol}
                    headCells={headings}
                />
                <tbody>
                    {rowMarkup}
                </tbody>
            </Table>
            <div className="sticky-column" style={{ width: "40%" }}>
                {selectedCategory && (
                    <ChartComponent category={selectedCategory} />
                )}
            </div>
        </Stack>
    </>);
};

export default Budgets;