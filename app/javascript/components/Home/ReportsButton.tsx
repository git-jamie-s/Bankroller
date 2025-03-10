import React from "react";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BarChartIcon from '@mui/icons-material/BarChart';

interface Props {
    isReportsPage: boolean;
}
const ReportsButton: React.FC<Props> = ({ isReportsPage }) => {
    return (
        <Dropdown>
            <MenuButton
                startDecorator={<BarChartIcon />}
                color="primary"
                variant="solid"
                endDecorator={<ArrowDropDownIcon />}
            >
                Reports
            </MenuButton>
            <Menu>
                <MenuItem component="a" href="/reports/summary">Summary Report</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default ReportsButton;