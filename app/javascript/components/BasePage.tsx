import React from "react";
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';

type Props = {
    title: string;
    children: React.ReactNode
};

export const BasePage: React.FC<Props> = ({ title, children }) => {
    return (
        <CssVarsProvider>
            <Sheet variant="outlined">
                {children}
            </Sheet>
        </CssVarsProvider>
    );
};