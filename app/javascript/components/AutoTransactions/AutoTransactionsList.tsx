import React, { } from "react";
import { Button, IndexTable, useIndexResourceState } from "@shopify/polaris";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import { FormatCAD } from "../../helpers/Formatter";
import { StateOption } from "../../helpers/useFilterState";

interface Props {
    loading?: boolean;
    sorting: StateOption<string>;
    autoTransactionArray: any[];
    paginationInfo: any;
}

export const AutoTransactionsList: React.FC<Props> = ({ loading, sorting, autoTransactionArray, paginationInfo }) => {
    const desc = sorting.current.includes(" desc");
    const array = autoTransactionArray;

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
        { id: 'description', title: titleButton("Matching Description", "description") },
        { id: 'type', title: titleButton("Matching Type", "transaction_type") },
        { id: 'category', title: titleButton("Matching category", "category_id") },
        { id: 'amount', title: titleButton("Matching amount", "amount") },
    ];

    const onDelete = (id) => {
        console.log("Deleting autoTransaction", id);
    };
    const onEdit = (id) => { };

    const rowMarkup = array.map(
        (autoTransaction, index) => {
            const amount = autoTransaction.amount && FormatCAD(autoTransaction.amount);
            return (
                <IndexTable.Row
                    id={autoTransaction.id}
                    key={autoTransaction.id}
                    position={index}>
                    <IndexTable.Cell>
                        <Button icon={DeleteIcon} onClick={() => onDelete(autoTransaction.id)} />
                        <Button icon={EditIcon} onClick={() => onEdit(autoTransaction.id)} />
                    </IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.description}</IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.transactionType}</IndexTable.Cell>
                    <IndexTable.Cell>{autoTransaction.categoryId}</IndexTable.Cell>
                    <IndexTable.Cell>{amount}</IndexTable.Cell>
                </IndexTable.Row>
            )
        }
    );

    return (
        <IndexTable
            headings={headings}
            itemCount={array.length}
            selectable={false}
            hasZebraStriping
            loading={loading}
            pagination={paginationInfo}
        >
            {rowMarkup}
        </IndexTable>
    );

};

