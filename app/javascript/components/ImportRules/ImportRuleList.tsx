import React, { useState } from "react";
import { FormatCAD } from "../../helpers/Formatter";
import { StateOption, useFilterState } from "../../helpers/useFilterState";
import { ImportRuleEditDialog } from "./ImportRuleEdit/ImportRuleEditDialog";
import { ImportRuleType } from "../../graphql/Types";
import { GMUpsertImportRule } from "../../graphql/GMUpsertImportRule";
import { GMDeleteImportRule } from "../../graphql/GMDeleteImportRule";
import { CircularProgress, IconButton, Snackbar, Table } from "@mui/joy";
import { DeleteForever, Edit } from '@mui/icons-material';
import SortTableHead from "../../helpers/SortTableHead";

interface Props {
    loading?: boolean;
    sorting: StateOption<string>;
    importRuleArray: ImportRuleType[];
    paginator: React.ReactElement;
}

export const ImportRulesList: React.FC<Props> = ({ loading, sorting, importRuleArray, paginator }) => {
    const desc = sorting.current.includes(" desc");
    const sortCol = sorting.current.split(" ")[0];

    const [deleteImportRule, { data: deleteData, error: deleteError }] = GMDeleteImportRule();
    const [upsertImportRule, { data: updateData, error: updateError }] = GMUpsertImportRule();

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const editingImportRule = useFilterState<ImportRuleType | null>(null);

    const handleSortClick = (sortVal) => {
        const sameCol = sorting.current.startsWith(sortVal);

        const newDesc = sameCol == desc ? "asc" : "desc";
        const newSortVal = `${sortVal} ${newDesc}, id ${newDesc}`;
        sorting.setter(newSortVal);
    }

    const headings: any[] = [
        { id: "buttons", label: "", nosort: true },
        { id: 'description', label: "Description" },
        { id: 'type', label: "Type" },
        { id: 'amount', label: "Amount" },
        { id: 'account.account_name', label: "Account" },
        { id: 'category_id', label: "Category" },
    ];

    const onDelete = (id) => {
        deleteImportRule({ variables: { id: id } })
            .then(() => { setToastMessage("Rule deleted") })
            .catch((e) => { setToastMessage(e.message); });
    };
    const onEdit = (importRule) => {
        editingImportRule.setter(importRule);
    };

    const handleSave = (apply) => {
        const changed: ImportRuleType = editingImportRule.current!;

        const amount = changed.amount === 0 ? null : changed.amount;
        const input = {
            id: changed.id,
            description: changed.description,
            categoryId: changed.categoryId,
            amount: amount,
            transactionType: changed.transactionType,
            accountId: changed.account?.id || null
        };
        upsertImportRule({ variables: { importRule: input, apply: apply } })
            .then(() => {
                editingImportRule.setter(null);
                setToastMessage("Saved");
            })
            .catch((e) => { setToastMessage(e.message) });
    };

    const rowMarkup = importRuleArray.map(
        (autoTransaction, index) => {
            const amount = autoTransaction.amount && FormatCAD(autoTransaction.amount);
            const accountName = autoTransaction.account?.accountName;
            return (
                <tr key={index}>
                    <td>
                        <IconButton onClick={() => onDelete(autoTransaction.id)} ><DeleteForever /></IconButton>
                        <IconButton onClick={() => onEdit(autoTransaction)} ><Edit /></IconButton>
                    </td>
                    <td>{autoTransaction.description}</td>
                    <td>{autoTransaction.transactionType}</td>
                    <td>{amount}</td>
                    <td>{accountName}</td>
                    <td>{autoTransaction.categoryId}</td>
                </tr>
            )
        }
    );

    const toastMarkup = toastMessage ? (
        <Snackbar
            open={true}
            onClose={() => setToastMessage(null)} >{toastMessage}</Snackbar>
    ) : null;

    const editorMarkup = editingImportRule.current &&
        <ImportRuleEditDialog
            importRule={editingImportRule}
            onClose={() => editingImportRule.setter(null)}
            onSave={handleSave} />;

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Table
                size="sm"
                stickyHeader
                stickyFooter>
                <SortTableHead
                    headCells={headings}
                    onRequestSort={handleSortClick}
                    order={desc ? "desc" : "asc"}
                    orderBy={sortCol}
                />
                <tbody>
                    {rowMarkup}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={headings.length}>
                            {paginator}
                        </td>
                    </tr>
                </tfoot>

            </Table>
            {toastMarkup}
            {editorMarkup}
        </>
    );

};

