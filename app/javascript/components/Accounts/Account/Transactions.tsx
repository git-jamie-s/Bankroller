import React, { useRef, useState } from "react";
import { GQTransactions } from "../../../graphql/GQTransactions";
import { PageInfo, PaginationQueryParams } from "../../../graphql/PaginationType";
import { useFilterState } from "../../../helpers/useFilterState";
import { AmountLimit } from "./TransactionFilter/AmountFilter";
import { ImportRuleType, PeriodEnum, TransactionType, WeekendAdjustEnum } from "../../../graphql/Types";
import { GMUpdateTransaction } from "../../../graphql/GMUpdateTransaction";
import { TransactionRow } from "./TransactionRow";
import { GMUpsertImportRule } from "../../../graphql/GMUpsertImportRule";
import { GMCreateScheduledTransaction } from "../../../graphql/GMCreateScheduledTransaction";
import SortTableHead, { HeadCell } from "../../../helpers/SortTableHead";
import { Sheet, Snackbar, Table } from "@mui/joy";
import Paginator from "./Paginator";
import { TransactionFilter } from "./TransactionFilter/TransactionFilter";
import { ImportRuleEditDialog } from "../../ImportRules/ImportRuleEdit/ImportRuleEditDialog";
import { ScheduleTransactionDialog } from "./ScheduleTransactionDialog/ScheduleTransactionDialog";

interface Props {
    account: any;
};

export const Transactions: React.FC<Props> = ({ account }) => {
    const accountId = account.id;
    const [sort, setSort] = useState('date desc, id desc');
    const sortCol = sort.split(" ")[0];

    const [updateTransaction] = GMUpdateTransaction();
    const [upsertImportRule, { data: updateData, error: updateError }] = GMUpsertImportRule();
    const [createScheduledTransaction, { data: createSchedTxData }] = GMCreateScheduledTransaction();

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const createRule = useFilterState<ImportRuleType | null>(null);
    const createSxTx = useFilterState<TransactionType | null>(null);

    const onCreateRule = (transaction) => {
        const importRule: ImportRuleType = {
            id: "",
            amount: transaction.amount,
            description: transaction.description!,
            transactionType: transaction.transactionType,
            categoryId: transaction.categoryId!,
            account: transaction.account
        };
        createRule.setter(importRule);
    };
    const onSaveNewRule = (apply) => {
        const changed: ImportRuleType = createRule.current!;

        const amount = changed.amount === 0 ? null : changed.amount;
        const input = {
            id: null,
            description: changed.description,
            categoryId: changed.categoryId,
            amount: amount,
            transactionType: changed.transactionType,
            accountId: changed.account?.id || null
        };

        upsertImportRule({ variables: { importRule: input, apply: apply } })
            .then(() => {
                setToastMessage("New Rule Saved.");
                createRule.setter(null);
            })
            .catch((e) => { setToastMessage(e.message) });
    };

    const onScheduleTransaction = (transaction) => {
        createSxTx.setter(transaction);
    }

    const resetPagination = () => {
        pageNumber.current = 1;
        setPagination({ first: pageSize.current });
    }

    const query = useFilterState<string>('', resetPagination);
    const category = useFilterState<string>('', resetPagination);
    const transactionTypes = useFilterState([] as string[], resetPagination);
    const amountLimit = useFilterState<AmountLimit>({ low: undefined, high: undefined });

    const pageNumber = useRef<number>(0);
    const pageSize = useRef<number>(50);
    const [pagination, setPagination] = useState<PaginationQueryParams>({ first: pageSize.current });

    const onEditComplete = ((value) => {
        if (value) {
            const sliced = { id: value.id, categoryId: value.categoryId, description: value.description };
            updateTransaction({ variables: { transaction: sliced } });
        }
    });

    const setTransactionCategory = (id, v) => {
        const sliced = { id, categoryId: v };

        updateTransaction({ variables: { transaction: sliced } })
            .then(() => {
                setToastMessage("Transaction saved");
            }).catch((e) => setToastMessage(e.message));
    }

    const editingTransactionDesc = useFilterState<TransactionType | null>(null, onEditComplete);

    const categoryFilter = Boolean(category.current?.length) ? [category.current] : [];
    const { transactions, error } = GQTransactions(sort, accountId,
        query.current,
        categoryFilter,
        transactionTypes.current,
        amountLimit.current,
        pagination);
    if (error) return <p>Error : {error.message}</p>;

    const rowCount = transactions?.totalCount || 0;

    const pageInfo: PageInfo = transactions?.pageInfo || {}

    const includeBalance = sortCol === "date";
    const includeAccount = accountId === "0";

    const rowMarkup = transactions?.edges.map(
        (edge, index) => {
            const transaction = edge.node;

            return <TransactionRow
                index={index}
                transaction={transaction}
                includeAccount={includeAccount}
                includeBalance={includeBalance}
                editingDescription={editingTransactionDesc}
                setTransactionCategory={setTransactionCategory}
                onCreateRule={onCreateRule}
                onScheduleTransaction={onScheduleTransaction} />;
        }
    );

    const desc = sort.includes(" desc");

    const handleSortClick = (sortVal) => {
        const sameCol = sort.startsWith(sortVal);

        const newDesc = sameCol == desc ? "asc" : "desc";
        const newSortVal = `${sortVal} ${newDesc}, id ${newDesc}`;
        setSort(newSortVal);
        resetPagination();
    }

    const headings: HeadCell[] = [
        { id: 'date', label: "Date" },
        { id: 'transaction_type', label: "Type" },
        { id: 'description', label: "Description", style: { width: "25%" } },
        { id: 'category_id', label: "Category", style: { width: "25%" } },
        { id: 'amount', label: "Amount" },
    ];

    if (includeAccount) {
        headings.unshift({ id: 'account', label: "Account", sort: false });
    }
    headings.unshift({ id: 'actions', label: "", style: { width: "40px", wordWrap: false } });

    if (includeBalance) {
        headings.push({ id: 'balance', label: "Balance", sort: false });
    }

    const onNextPage = () => {
        pageNumber.current++;
        setPagination({ first: pageSize.current, after: pageInfo.endCursor || undefined })
    }
    const onPreviousPage = () => {
        pageNumber.current--;
        setPagination({ last: pageSize.current, before: pageInfo.startCursor || undefined })
    }

    const toastMarkup = toastMessage ? (
        <Snackbar
            open={true}
            onClose={() => { setToastMessage(null) }}
            autoHideDuration={1500}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            {toastMessage}
        </Snackbar >
    ) : null;


    const handleScheduleTransaction = (transactionId: string, period: PeriodEnum, weekend: WeekendAdjustEnum) => {
        createScheduledTransaction({
            variables: {
                transactionId,
                period,
                weekendAdjust: weekend
            }
        }).then(() => {
            setToastMessage("Transaction Scheduled");
            createSxTx.setter(null);
        }).catch((e) => {
            setToastMessage(e.message)
        });
    }

    return (
        <>
            <TransactionFilter
                query={query}
                category={category}
                transactionTypes={transactionTypes}
                amountLimit={amountLimit} />
            <Sheet>
                <Table
                    stripe="even"
                    size="sm"
                    stickyHeader
                    stickyFooter
                >
                    <SortTableHead
                        onRequestSort={handleSortClick}
                        order={desc ? "desc" : "asc"}
                        orderBy={sortCol}
                        headCells={headings}
                    />
                    <tbody>
                        {rowMarkup}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={headings.length}>
                                <Paginator
                                    rowCount={rowCount}
                                    rowsPerPage={pageSize}
                                    page={pageNumber}
                                    onPreviousPage={onPreviousPage}
                                    onNextPage={onNextPage}
                                />
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </Sheet>
            <ImportRuleEditDialog
                importRule={createRule}
                onClose={() => { createRule.setter(null) }}
                onSave={onSaveNewRule}
            />
            <ScheduleTransactionDialog transaction={createSxTx}
                onClose={() => createSxTx.setter(null)}
                onSave={handleScheduleTransaction} />
            {toastMarkup}
        </>
    );
};


