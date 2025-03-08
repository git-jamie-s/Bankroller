import React, { useState } from "react";
import { Outlet } from "react-router-dom";

export const Reports: React.FC = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

export default Reports;