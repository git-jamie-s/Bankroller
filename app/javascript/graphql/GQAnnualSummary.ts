import { useQuery, gql } from '@apollo/client';
import { PaginationQueryParams } from './PaginationType';
import { AmountLimit } from '../components/Accounts/Account/TransactionFilter/AmountFilter';

export function GQAnnualSummary(reportYear: number | undefined) {
    const GET_ANNUAL_SUMMARY = gql`
        query GetAnnualSummary($reportYear: Int) {
            annualSummary(reportYear: $reportYear) {
        		totalSpent
                totalBudget
                reportYear
                yearPortion
                expenses {
                    category
                    annualBudget
                    spent
                }
                annualTotals {
                    year
                    spent 
                    budget
                }
            }
        }`;

    const { data, loading, error } = useQuery(GET_ANNUAL_SUMMARY, {
        variables: {
            reportYear
        }
    });

    const annualSummary = data?.annualSummary || [];
    return { annualSummary, loading, error };
}