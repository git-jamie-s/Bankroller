import React from "react"
import { Box, FormControl, FormLabel, IconButton, Select, Typography, Option } from "@mui/joy";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"

function labelDisplayedRows({
    from,
    to,
    count,
}: {
    from: number;
    to: number;
    count: number;
}) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

interface Props {
    rowCount: number;
    rowsPerPage: React.MutableRefObject<number>;
    page: React.MutableRefObject<number>;
    onPreviousPage: () => void;
    onNextPage: () => void;

}

const Paginator: React.FC<Props> = ({ rowCount, rowsPerPage, page, onPreviousPage, onNextPage }) => {
    const sizeOptions = [
        <Option key={0} value={25}>25</Option>,
        <Option key={1} value={50}>50</Option>,
        <Option key={2} value={100}>100</Option>,
    ];

    const getLabelDisplayedRowsTo = () => {
        if (rowCount === -1) {
            return (page.current + 1) * rowsPerPage.current;
        }
        return rowsPerPage.current === -1
            ? rowCount
            : Math.min(rowCount, (page.current + 1) * rowsPerPage.current);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'flex-end',
            }}
        >
            <FormControl orientation="horizontal" size="sm">
                <FormLabel>Rows per page:</FormLabel>
                <Select onChange={(v) => rowsPerPage.current = Number(v)} value={rowsPerPage.current}>
                    {sizeOptions}
                </Select>
            </FormControl>
            <Typography sx={{ textAlign: 'center', minWidth: 80 }}>
                {labelDisplayedRows({
                    from: rowCount === 0 ? 0 : page.current * rowsPerPage.current + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: rowCount === -1 ? -1 : rowCount,
                })}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page.current === 0}
                    onClick={onPreviousPage}
                    sx={{ bgcolor: 'background.surface' }}
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={
                        rowCount !== -1
                            ? page.current >= Math.ceil(rowCount / rowsPerPage.current) - 1
                            : false
                    }
                    onClick={onNextPage}
                    sx={{ bgcolor: 'background.surface' }}
                >
                    <KeyboardArrowRight />
                </IconButton>
            </Box>
        </Box>);
}

export default Paginator;