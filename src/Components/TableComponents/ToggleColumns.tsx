import { Checkbox, Grid, Menu, MenuItem } from '@mui/material';
import { MenuOpen } from '@mui/icons-material';
import React from 'react';
import ButtonWithTooltip from '@components/GenericComponents/Buttons/ButtonWithTooltip';
import { useTranslation } from 'next-i18next';

export type TtoggleColumnsProps = {
	allColumns: any;
	getToggleHideAllColumnsProps: any;
	disableToggleColumns?: boolean;
};

function ToggleColumns({
	allColumns,
	getToggleHideAllColumnsProps,
	disableToggleColumns,
}: TtoggleColumnsProps) {
	const { t } = useTranslation('searchField');
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return !disableToggleColumns ? (
		<>
			<Grid item>
				<ButtonWithTooltip
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					tooltipText={t('toogleColumn')}
					aria-label={t('toogleColumn')}
					startIcon={<MenuOpen />}
					onClick={handleClick}
				/>
			</Grid>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem>
					<Grid container wrap={'wrap'} style={{ alignItems: 'center' }}>
						<Checkbox
							{...getToggleHideAllColumnsProps()}
							indeterminate={false}
						/>
						All
						{allColumns.map((column: any) => (
							<div key={column.id}>
								<Grid item>
									<label style={{ display: 'flex', alignItems: 'center' }}>
										<Checkbox {...column.getToggleHiddenProps()} />
										{column.Header}
									</label>
								</Grid>
							</div>
						))}
					</Grid>
				</MenuItem>
			</Menu>
		</>
	) : null;
}

export default ToggleColumns;
