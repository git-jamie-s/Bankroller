import { Input } from "@mui/joy";
import React, { useState } from "react"


interface DebounceProps {
    value: string;
    onChange: (value: string) => void;
    debounceTimeout?: number;
    other: any;
};

const DebounceNumberInput: React.FC<DebounceProps> = ({ value, onChange, debounceTimeout = 1000, other }) => {
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    const [localValue, setLocalValue] = useState<string>(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        setLocalValue(event.target.value.replace(/\D/g, ""));
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onChange(event.target.value);
        }, debounceTimeout);
    };

    const handleBlur = () => {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
        onChange(localValue);
    }

    return <Input
        onChange={handleChange}
        onBlur={handleBlur}
        value={localValue}
        {...other} />;
};

export default DebounceNumberInput;