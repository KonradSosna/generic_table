import React from 'react';

import { TableSortLabel, Grid } from '@mui/material';

type TColumnHeaderProps = {
	title: string;
	canSort?: boolean;
	isSorted?: boolean;
	direction: 'asc' | 'desc';
};
const ColumnHeader: React.FC<TColumnHeaderProps> = ({
	title,
	isSorted,
	direction,
	canSort,
}) => (
	<Grid container alignItems="center" style={{ justifyContent: 'left' }}>
		<Grid item>{title}</Grid>
		<Grid item>
			{canSort && isSorted ? (
				<TableSortLabel active={isSorted} direction={direction} />
			) : null}
		</Grid>
	</Grid>
);

export default ColumnHeader;
