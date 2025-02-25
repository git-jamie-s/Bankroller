import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FormatAmountString, FormatCAD } from '../../../helpers/Formatter';
import './SummaryBarChart.css';

interface Props {
    summary: any;
}

const SummaryBarChart: React.FC<Props> = ({ summary }) => {
    const data = summary.annualTotals.map((yt) => {
        const budget = yt.budget || 0;

        let amount = -1 * yt.spent;
        let over = 0;
        let unused = 0;

        if (budget && budget > 0) {
            if (amount > budget) {
                over = amount - budget;
                amount = budget;
            }
            unused = budget - amount;
        }

        return {
            year: yt.year,
            Spent: amount / 100,
            Unused: unused / 100,
            Overspent: over / 100,
        };
    });

    const customTooltip = (props) => {
        if (props.active && props.payload?.length) {
            const datum = props.payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p>Spent: {FormatCAD(-1 * props.payload[0].value * 100)}</p>
                    {datum.Unused > 0 && <p>Unused: {FormatCAD(datum.Unused * 100)}</p>}
                    {datum.Overspent > 0 && <p>Overspent: {FormatCAD(datum.Overspent * 100)}</p>}
                </div>
            );
        }

        return null;
    };
    const CAD = new Intl.NumberFormat('en-CA', { style: "currency", currency: "CAD" });
    const formatter = (value) => {
        const amount = Number(value) / 1000;
        return `$${amount.toFixed(0)}k`;
    };


    return (
        <ResponsiveContainer width="100%" height={225}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatter} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="Spent" stackId="a" fill="#8884d8" />
                <Bar dataKey="Unused" stackId="a" fill="#82ca9d" />
                <Bar dataKey="Overspent" stackId="a" fill="#ff8888" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SummaryBarChart;