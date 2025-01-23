import React, { useCallback, useState, useEffect } from "react"
import { TransactionType } from "../../../graphql/Types";
import { Button, Combobox, Icon, Listbox, TextField } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { GQCategories } from "../../../graphql/GQCategories";
import { StateOption } from "../../../helpers/useFilterState";

interface Props {
    editing: StateOption<TransactionType | null>;
    transaction: TransactionType;
}

export const TransactionDescription: React.FC<Props> = ({ editing, transaction }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                editing.setter(null);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const [text, setText] = useState<string>(transaction.description || "");

    const selectMe = () => {
        setText(transaction.description || "");
        editing.setter(transaction);
    }

    const onEditComplete = () => {
        editing.setter({ ...editing.current, description: text });
    }

    if (editing.current !== transaction) {
        return <Button fullWidth textAlign="start" variant="tertiary" onClick={selectMe}>{transaction.description}</Button>;
    }

    return (
        <TextField
            onChange={setText}
            label="Description"
            labelHidden
            value={text}
            autoComplete="off"
            variant="borderless"
            autoFocus
            onBlur={onEditComplete}
        />
    );

};