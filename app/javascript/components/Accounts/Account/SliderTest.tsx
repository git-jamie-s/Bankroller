import { Slider } from "@mui/joy";
import React, { useState } from "react"

export const SliderTest: React.FC = () => {

    const [value, setValue] = useState<number[]>([0, 100]);

    function scaler(input) {

        const e = 2.718281828459045
        // 50,000 will be the max.

        // How to scale n such that e ** (n) == 50,000
        // top = 50000;
        // log(top) = 10.819778284410283
        // 100 / log(top) = 9.242333564642943


        return e ** (input / 9.242333564642943);
    }

    const handleChange = (event, newValue) => {
        console.log(scaler(newValue[0]).toFixed(0));
        setValue(newValue);
    }

    const format = (value, index) => {
        if (value == 100) { return "∞" };

        return scaler(value).toFixed(0);
    }

    return <Slider
        value={value}
        aria-label="Small"
        valueLabelDisplay="auto"
        onChange={(e, v) => setValue(v as number[])}
        onChangeCommitted={handleChange}
        valueLabelFormat={format} />

};