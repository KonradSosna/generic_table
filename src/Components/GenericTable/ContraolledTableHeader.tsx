import React from 'react';
import styled from 'styled-components';
import { Box, Grid } from '@mui/material';
import ToggleColumns, {
	TtoggleColumnsProps,
} from './TableComponents/ToggleColumns';

const ActionsWrapper = styled(Grid)`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
`;

const RightActionsWrapper = styled(ActionsWrapper)`
	margin-left: auto;
	margin-right: 0;
	margin-top: 10px;
	margin-bottom: 10px;
	flex-wrap: nowrap;
`;

export type ControlledTableHeaderProps = {
	title?: string;
	primaryActionsComponent?: React.ReactNode;
	secondaryActionsComponent?: React.ReactNode;
	headerActions?: React.ReactNode;
	subHeader1?: string;
	subHeader2?: string;
	disableToggleColumns?: boolean;
};

export const ControlledTableHeader = ({
	title,
	primaryActionsComponent,
	secondaryActionsComponent,
	headerActions,
	subHeader1,
	subHeader2,
	disableToggleColumns,
	allColumns,
	getToggleHideAllColumnsProps,
}: ControlledTableHeaderProps & TtoggleColumnsProps) => (
	<Box mb={2}>
		<Grid container direction="row">
			{title && (
				<Grid item>
					<Box fontWeight="fontWeightBold" fontSize="1.8rem" marginTop="10px">
						{title}
					</Box>
					{subHeader1 && (
						<Box fontSize="1rem" marginTop="2px">
							{subHeader1}
						</Box>
					)}
					{subHeader2 && (
						<Box fontSize="1rem" marginTop="2px">
							{subHeader2}
						</Box>
					)}
				</Grid>
			)}
			<Grid item xs={12}>
				{headerActions && (
					<>
						<Box fontWeight="fontWeightBold" fontSize="1.8rem" marginTop="16px">
							<ActionsWrapper item>{headerActions}</ActionsWrapper>
						</Box>
					</>
				)}
			</Grid>
			<Grid item xs={12}>
				<Grid
					container
					spacing={2}
					justifyContent="space-between"
					alignItems="flex-end"
				>
					<Grid item>
						{secondaryActionsComponent && (
							<ActionsWrapper item>{secondaryActionsComponent}</ActionsWrapper>
						)}
					</Grid>
					<Grid item>
						<Grid
							container
							justifyContent="space-between"
							direction="row"
							wrap="nowrap"
							alignItems="center"
						>
							{primaryActionsComponent && (
								<RightActionsWrapper item>
									{primaryActionsComponent}
								</RightActionsWrapper>
							)}
							<ToggleColumns
								disableToggleColumns={disableToggleColumns}
								allColumns={allColumns}
								getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	</Box>
);

ControlledTableHeader.defaultProps = {
	title: undefined,
	primaryActionsComponent: undefined,
	secondaryActionsComponent: undefined,
	headerActions: undefined,
	subHeader1: undefined,
	subheader2: undefined,
};
