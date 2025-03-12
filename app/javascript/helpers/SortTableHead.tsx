import { Box, Link } from "@mui/joy";
import React from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { visuallyHidden } from '@mui/utils';

export type Order = 'asc' | 'desc';

export interface HeadCell {
  id: string;
  label: string;
  sort?: boolean | undefined;
  style?: any;
}

interface SortTableHeadProps {
  onRequestSort: (id: string) => void;
  order: Order;
  orderBy: string;
  headCells: HeadCell[];
}

const SortTableHead: React.FC<SortTableHeadProps> = (props) => {
  const { headCells, order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (id: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(id);
    };

  const ths = headCells.map((headCell) => {
    const active = orderBy === headCell.id;
    const sortable = headCell.sort === undefined ? true : headCell.sort;
    const body = sortable ?
      <Link
        underline="none"
        color="neutral"
        textColor={active ? 'primary.plainColor' : undefined}
        component="button"
        onClick={createSortHandler(headCell.id)}

        endDecorator={
          <ArrowDownwardIcon
            sx={[active ? { opacity: 1 } : { opacity: 0 }]}
          />
        }
        sx={{
          fontWeight: 'lg',

          '& svg': {
            transition: '0.2s',
            transform:
              active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
          },

          '&:hover': { '& svg': { opacity: 1 } },
        }}
      >
        {headCell.label}
        {active ? (
          <Box component="span" sx={visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </Box>
        ) : null}
      </Link>
      :
      headCell.label;

    return (
      <th
        style={headCell.style}
        key={headCell.id}
        aria-sort={
          active
            ? ({ asc: 'ascending', desc: 'descending' } as const)[order]
            : undefined
        }
      >
        {body}
      </th>
    );
  });

  return (
    <thead>
      <tr>
        {ths}
      </tr>
    </thead>
  );
}

export default SortTableHead;