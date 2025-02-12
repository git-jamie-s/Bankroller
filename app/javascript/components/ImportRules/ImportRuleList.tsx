import React, { useState } from "react";
import { Button, Frame, IndexTable, SkeletonPage, Toast, useIndexResourceState } from "@shopify/polaris";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import { FormatCAD } from "../../helpers/Formatter";
import { StateOption, useFilterState } from "../../helpers/useFilterState";
import { ImportRuleEditDialog } from "./ImportRuleEdit/ImportRuleEditDialog";
import { ImportRuleType } from "../../graphql/Types";
import { GMUpsertImportRule } from "../../graphql/GMUpsertImportRule";
import { GMDeleteImportRule } from "../../graphql/GMDeleteImportRule";

interface Props {
    loading?: boolean;
    sorting: StateOption<string>;
    importRuleArray: ImportRuleType[];
    paginationInfo: any;
}

export const ImportRulesList: React.FC<Props> = ({ loading, sorting, importRuleArray, paginationInfo }) => {
    const desc = sorting.current.includes(" desc");

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

    const dirIcon = desc ? ArrowDownIcon : ArrowUpIcon;
    function titleButton(label: string, sortVal: string) {
        const icon = (sorting.current.startsWith(sortVal)) ? dirIcon : undefined;
        return <Button variant="tertiary"
            fullWidth
            textAlign="left"
            icon={icon}
            onClick={() => handleSortClick(sortVal)}>{label}
        </Button>;
    }

    const headings: NonEmptyArray<IndexTableHeading> = [
        { id: "buttons", title: "" },
        { id: 'description', title: titleButton("Description", "description") },
        { id: 'type', title: titleButton("Type", "transaction_type") },
        { id: 'amount', title: titleButton("Amount", "amount") },
        { id: 'account', title: titleButton("Account", "account.account_name") },
        { id: 'category', title: titleButton("Category to set", "category_id") },
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
                <IndexTable.Row
                    id={autoTransaction.id}
                    key={autoTransaction.id}
                    position={index}>
                    <IndexTable.Cell>
                        <Button icon={DeleteIcon} onClick={() => onDelete(autoTransaction.id)} />
                        <Button icon={EditIcon} onClick={() => onEdit(autoTransaction)} />
                    </IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.description}</IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.transactionType}</IndexTable.Cell>
                    <IndexTable.Cell>{amount}</IndexTable.Cell>
                    <IndexTable.Cell>{accountName}</IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.categoryId}</IndexTable.Cell>
                </IndexTable.Row>
            )
        }
    );

    const toastMarkup = toastMessage ? (
        <Toast content={toastMessage} onDismiss={() => { setToastMessage(null) }} duration={2000} />
    ) : null;

    const editorMarkup = editingImportRule.current &&
        <ImportRuleEditDialog
            importRule={editingImportRule}
            onClose={() => editingImportRule.setter(null)}
            onSave={handleSave} />;

    if (loading) {
        return <SkeletonPage />;
    }

    return (
        <Frame>
            <IndexTable
                headings={headings}
                itemCount={importRuleArray.length}
                selectable={false}
                hasZebraStriping
                pagination={paginationInfo}
            >
                {rowMarkup}
            </IndexTable>
            {toastMarkup}
            {editorMarkup}
        </Frame>
    );

};

