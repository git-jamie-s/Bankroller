import React, { useState, useEffect } from "react"
import { TransactionType } from "../../../graphql/Types";
import { StateOption } from "../../../helpers/useFilterState";
import { Button, Input } from "@mui/joy";

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
        return <Button
            variant="plain"
            size="sm"
            color="neutral"
            fullWidth
            onClick={selectMe}
            sx={{ display: 'block', textAlign: 'start', fontWeight: "normal", padding: "1px" }}>
            {transaction.description}
        </Button>;
    }

    return (
        <Input
            fullWidth
            size="sm"
            value={text}
            autoFocus
            onBlur={onEditComplete}
        />
    );

};