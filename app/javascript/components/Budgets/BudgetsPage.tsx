import React from "react";
import { Button, Spinner, IndexTable, Grid } from "@shopify/polaris";
import { ArrowDownIcon, ArrowUpIcon } from "@shopify/polaris-icons";
import { gql } from '@apollo/client';
import { GQCategories } from "../../graphql/GQCategories";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { annualBudget } from "../../helpers/Formatter";
import { CategoryType } from "../../graphql/Types";
import { useFilterState } from "../../helpers/useFilterState";
import { BudgetRow } from "./BudgetRow";
import { GMUpdateCategory } from "../../graphql/GMUpdateCategory";
import ChartComponent from "./BudgetChart";
import './BudgetsPage.css';

export const Budgets: React.FC = () => {
    const GET_ACCOUNTS = gql`
        query GetAccounts { 
            accounts {
                id
                accountName
                created
            }
        }`;

    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

    const { categoriesData, loading, error } = GQCategories();
    const [updateCategory] = GMUpdateCategory();

    const sorting = useFilterState<string>("category asc");

    const onEditComplete = ((value) => {
        if (value) {
            const sliced = { id: value.id, budgetPeriod: value.budgetPeriod, budgetAmount: value.budgetAmount };
            updateCategory({ variables: { category: sliced } });
        }
    });
    const editingAmount = useFilterState<CategoryType | null>(null, onEditComplete);

    if (loading) return <Spinner />;
    if (error) return <p>Error : {error.message}</p>;

    const sortCol = sorting.current.split(" ")[0];
    const desc = sorting.current.includes(" desc");
    const dirIcon = desc ? ArrowDownIcon : ArrowUpIcon;
    const handleSortClick = (sortVal) => {
        const sameCol = sorting.current.startsWith(sortVal);

        const newDesc = sameCol == desc ? "asc" : "desc";
        const newSortVal = `${sortVal} ${newDesc}, id ${newDesc}`;
        sorting.setter(newSortVal);
    }

    function titleButton(label: string, sortVal: string) {
        const icon = (sorting.current.startsWith(sortVal)) ? dirIcon : undefined;
        return <Button variant="tertiary"
            fullWidth
            textAlign="left"
            icon={icon}
            onClick={() => handleSortClick(sortVal)}>{label}
        </Button >;
    }

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: 'category', title: titleButton("Category", "category") },
        { id: 'period', title: titleButton("Budget Period", "period") },
        { id: 'amount', title: titleButton("Budget Amount", "amount") },
        { id: 'annual', title: titleButton("Annual Budget", "annualAmount") },
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
        <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
                <IndexTable
                    resourceName={{ singular: "", plural: "" }}
                    itemCount={200}
                    selectable={false}
                    hasZebraStriping
                    headings={headings}
                >
                    {rowMarkup}
                </IndexTable >
            </Grid.Cell>
            {selectedCategory && (
                <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
                    <div className="sticky-column">
                        <ChartComponent category={selectedCategory} />
                    </div>
                </Grid.Cell>)}
        </Grid>
    </>);
};

export default Budgets;