import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GQBudgetHistory } from '../../graphql/GQBudgetHistory';
import { Text } from '@shopify/polaris';

interface Props {
    category: string;
}

const ChartComponent: React.FC<Props> = ({ category }) => {
    const { budgetHistory, loading, error } = GQBudgetHistory(category);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    const data = budgetHistory.map((point) => {

        let amount = -1 * point.amount;
        let over = 0;
        if (amount > point.budget) {
            over = amount - point.budget;
            amount = point.budget;
        }
        let remainingBudget = point.budget - amount;

        return {
            name: point.date,
            Spent: amount / 100,
            Unused: remainingBudget / 100,
            Overspent: over / 100,
        };
    });


    return (
        <>
            <Text as="h2">Budget Chart: {category}</Text>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    // width={500}
                    // height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Spent" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Unused" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="Overspent" stackId="a" fill="#ff8888" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default ChartComponent;