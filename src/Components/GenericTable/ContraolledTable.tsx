import React, { useState } from 'react';
// @ts-ignore
import {
	useTable,
	useSortBy,
	usePagination,
	Column,
	useExpanded,
} from 'react-table';
import { OverridableStringUnion } from '@mui/types';
import {
	FirstPage,
	LastPage,
	KeyboardArrowLeft,
	KeyboardArrowRight,
	ExpandLess,
	ExpandMore,
} from '@mui/icons-material';

import {
	Table,
	TableBody,
	TableCell,
	TableHead as MuiTableHead,
	TableRow,
	IconButton,
	Select,
	MenuItem,
	Collapse,
	Box,
	CircularProgress,
	Grid,
} from '@mui/material';
import { useDebouncedEffect } from '../util/debouncedEffect';
import ColumnHeader from '../TableComponents/ColumnHeader';
import { TtoggleColumnsProps } from '../TableComponents/ToggleColumns';
import {
	ControlledTableHeader,
	ControlledTableHeaderProps,
} from './ContraolledTableHeader';
import { Waypoint } from 'react-waypoint';
import { OperationContext } from 'urql';
import { useTranslation } from 'next-i18next';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const TableHead = styled(MuiTableHead)`
	min-width: 75px;
	position: sticky;
	top: 0;
	background: white;
	${(props) => props.theme.breakpoints.down('md')} {
		display: none;
	}
`;

type ControlledTableRowProps = {
	hasMobileView?: boolean;
};
const ControlledTableRow = styled(TableRow, {
	shouldForwardProp: (prop) => prop !== 'hasMobileView',
})<ControlledTableRowProps>`
	cursor: pointer;
	border-bottom: 1px solid lightgray;

	${({ theme, hasMobileView }) =>
		hasMobileView &&
		css`
			${theme.breakpoints.down('md')} {
				tbody,
				tr,
				td {
					display: grid;
					width: 100%;
					grid-template-columns: 30% 1fr;
					text-align: center;
				}

				td {
					border: unset;

					& > * {
						display: flex;
						align-items: center;
						justify-content: center;
						text-align: center;
						justify-self: center;
					}
				}

				td::before {
					content: attr(aria-label);
					font-weight: bold;
				}
			}
		`}
`;

const ExpandableTableRow = styled(ControlledTableRow)`
	> * {
		text-align: left;
		cursor: pointer;
		@media (max-width: 800px) {
			tbody,
			tr,
			td {
				display: block;
				width: 100%;
			}

			td {
				padding: 0;
			}
		}
	}
`;

const ControlledTableHeadCell = styled(TableCell)`
	min-width: 80px;
	@media (max-width: 800px) {
	}
`;

type TableState = {
	pageIndex: number;
	pageSize: number;
	sortBy: { id: string; desc: boolean }[];
};

type ControlledTableProps<T> = {
	columns: Column[];
	data: T[];
	pageCount: number;
	handleRowClick: (row: any) => any;
	totalCount: number;
	noRecordsMessage: string;
	tableFilters: any;
	tableState: TableState;
	setTableState: (s: TableState) => any;
	hiddenColumns?: string[];
	renderRowSubComponent?: (row: any) => any;
	size?: OverridableStringUnion<'small' | 'medium'>;
	paginationEnabled?: boolean;
	styling?: React.CSSProperties;
	hideHeader?: boolean;
	tableLayoutStyle?: string;
	tableWidth?: string;
	setPageIndex?: (pageIndex: number) => void;
	isLoading?: boolean;
	options?: any;
	controlledTableHeaderProps?: ControlledTableHeaderProps;
	defaultSort?: [{ id: string; desc: boolean }];
	queryVariables?: TableState;
	executeQuery?: (v: Partial<OperationContext> | undefined) => void;
	isExpanding?: boolean;
	infScrollEnabled?: boolean;
	disableToggleColumns?: boolean;
	tableCellFontWeight?: string;
	hasMobileView?: boolean;
};

export function ControlledTable<T>({
	columns,
	data,
	pageCount: controlledPageCount,
	handleRowClick,
	totalCount,
	noRecordsMessage,
	tableFilters,
	tableState,
	setTableState,
	hiddenColumns,
	renderRowSubComponent,
	size,
	paginationEnabled,
	styling,
	hideHeader,
	setPageIndex,
	isLoading,
	controlledTableHeaderProps,
	defaultSort,
	queryVariables,
	executeQuery,
	isExpanding,
	infScrollEnabled,
	disableToggleColumns,
	tableCellFontWeight,
	hasMobileView,
}: ControlledTableProps<T>) {
	const handlePreventAcion = (
		e: React.MouseEvent<any>,
		callback: () => void
	) => {
		e.stopPropagation();
		e.preventDefault();
		callback();
	};

	const [expanded, setExpanded] = useState<number[]>([]);

	const toggleExpanded = React.useCallback(
		(rowId: number) => {
			if (expanded.includes(rowId)) {
				setExpanded(expanded.filter((id) => id !== rowId));
			} else {
				setExpanded([...expanded, rowId]);
			}
		},
		[expanded]
	);

	const extendedColumns = React.useMemo(
		() =>
			renderRowSubComponent
				? [
						{
							// Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
							//   <IconButton {...getToggleAllRowsExpandedProps()}>
							//     {isAllRowsExpanded ? <ExpandLess /> : <ExpandMore />}
							//   </IconButton>
							// ),
							Header: 'Details',
							id: 'expander',
							Cell: ({ row }: any) => (
								<IconButton
									{...row.getToggleRowExpandedProps()}
									onClick={(e) =>
										handlePreventAcion(e, () => {
											toggleExpanded(row.id);
										})
									}
									size="large"
								>
									{expanded.includes(row.id) ? <ExpandLess /> : <ExpandMore />}
								</IconButton>
							),
						},
						...columns,
				  ]
				: columns,
		[renderRowSubComponent, columns, expanded, toggleExpanded]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, sortBy },
		visibleColumns,
		allColumns,
		getToggleHideAllColumnsProps,
	} = useTable(
		{
			columns: extendedColumns,
			autoResetHiddenColumns: false,
			data,
			initialState: {
				pageSize: tableState.pageSize,
				pageIndex: tableState.pageIndex,
				sortBy: defaultSort ?? tableState.sortBy,
				hiddenColumns: hiddenColumns ?? [],
			},
			manualPagination: true,
			manualSortBy: true,
			pageCount: controlledPageCount,
		} as any,
		useSortBy,
		useExpanded,
		usePagination
	) as any;
	React.useEffect(() => {
		setTableState({ pageIndex, pageSize, sortBy });
	}, [setTableState, pageIndex, pageSize, sortBy]);

	React.useEffect(() => {
		if (setPageIndex) setPageIndex(pageIndex);
	});

	// Reset to 1st page
	useDebouncedEffect(() => gotoPage(0), 750, [tableFilters]);

	function getStartRow() {
		if (page.length === 0) {
			return 0;
		}

		if (pageIndex > 0) {
			return pageIndex * pageSize + 1;
		}

		return 1;
	}

	const startRow = getStartRow();
	const endRow =
		pageIndex > 0 ? pageIndex * pageSize + page.length : page.length;
	const { t } = useTranslation('controlledTable');

	const RowComponent = renderRowSubComponent
		? ExpandableTableRow
		: ControlledTableRow;

	const toggleColumnsProps: TtoggleColumnsProps = {
		allColumns,
		getToggleHideAllColumnsProps,
	};

	return (
		<>
			<div style={styling}>
				<ControlledTableHeader
					{...controlledTableHeaderProps}
					{...toggleColumnsProps}
					disableToggleColumns={disableToggleColumns}
				/>
				<Table {...getTableProps()} size={size}>
					{!hideHeader && (
						<TableHead>
							{headerGroups.map((headerGroup: any) => (
								// TODO: fix eslint issue below
								// eslint-disable-next-line react/jsx-key
								<TableRow {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column: any) => (
										<ControlledTableHeadCell
											{...column.getHeaderProps(column.getSortByToggleProps())}
											key={column.id}
										>
											<ColumnHeader
												title={column.render('Header')}
												canSort={column.canSort}
												isSorted={column.isSorted}
												direction={column.isSortedDesc ? 'desc' : 'asc'}
											/>
										</ControlledTableHeadCell>
									))}
								</TableRow>
							))}
						</TableHead>
					)}
					<TableBody {...getTableBodyProps()}>
						{!isLoading &&
							!isExpanding &&
							page.length === 0 && ( // no records
								<TableRow>
									<td
										className="MuiTableCell-root MuiTableCell-body"
										colSpan={visibleColumns.length}
										style={{ padding: '8px 0', textAlign: 'center' }}
									>
										{noRecordsMessage}
									</td>
								</TableRow>
							)}
						{isLoading && ( // loading
							<TableRow>
								<td
									className="MuiTableCell-root MuiTableCell-body"
									colSpan={visibleColumns.length}
									style={{ padding: '8px 0', textAlign: 'center' }}
								>
									<CircularProgress />
								</td>
							</TableRow>
						)}
						{!isLoading && // show data
							page.map((row: any, i: number) => {
								const rowExpanded = expanded.includes(row.id);
								prepareRow(row);
								return (
									<React.Fragment key={row.id}>
										<RowComponent
											hover={!rowExpanded}
											onClick={() => handleRowClick(row.original)}
											{...row.getRowProps()}
											hasMobileView={hasMobileView}
										>
											{row.cells.map((cell: any) => (
												<TableCell
													style={{ fontWeight: tableCellFontWeight }}
													{...cell.getCellProps()}
													key={`${row.id}_${cell.column.id}`}
													aria-label={cell.column.Header}
												>
													{cell.render('Cell')}
												</TableCell>
											))}
										</RowComponent>
										{renderRowSubComponent && (
											<ControlledTableRow hasMobileView={hasMobileView}>
												<TableCell
													style={{ paddingBottom: 0, paddingTop: 0 }}
													colSpan={visibleColumns.length}
												>
													<Collapse in={rowExpanded} timeout="auto">
														<Box pb={4}>
															{renderRowSubComponent({ ...row, rowExpanded })}
														</Box>
													</Collapse>
												</TableCell>
											</ControlledTableRow>
										)}
										{queryVariables && i === queryVariables?.pageSize - 1 && (
											<Waypoint
												onEnter={() => {
													executeQuery &&
														executeQuery(
															setPageSize(
																queryVariables?.pageSize +
																	queryVariables?.pageSize
															)
														);
												}}
											/>
										)}
									</React.Fragment>
								);
							})}
					</TableBody>
				</Table>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: 10,
					}}
				>
					{isExpanding && <CircularProgress />}
				</div>
			</div>
			{paginationEnabled && (
				<Grid
					container
					className="pagination"
					wrap="nowrap"
					sx={{ width: '100%', textAlign: 'center' }}
				>
					{!infScrollEnabled && (
						<Select
							variant="standard"
							value={pageSize}
							onChange={(e) => {
								setPageSize(Number(e.target.value));
							}}
						>
							{[25, 50, 100].map((pageSizeChoice) => (
								<MenuItem value={pageSizeChoice} key={pageSizeChoice}>
									{t('numRows', { count: pageSizeChoice })}
								</MenuItem>
							))}
						</Select>
					)}
					<Grid item>
						<IconButton
							onClick={() => gotoPage(0)}
							disabled={!canPreviousPage}
							aria-label={t('page.first')}
							size="small"
						>
							<FirstPage />
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton
							onClick={() => previousPage()}
							disabled={!canPreviousPage}
							aria-label={t('page.prev')}
							size="small"
						>
							<KeyboardArrowLeft />
						</IconButton>
					</Grid>
					<Grid
						item
						className="MuiTypography-root MuiTypography-caption"
						style={{
							flexGrow: 1,
							flexShrink: 1,
							flexBasis: 'inherit',
							textAlign: 'center',
							alignSelf: 'center',
						}}
					>
						{t('displayedRange', { startRow, endRow, totalCount })}
					</Grid>
					<Grid item>
						<IconButton
							onClick={() => nextPage()}
							disabled={!canNextPage}
							aria-label={t('page.next')}
							size="small"
						>
							<KeyboardArrowRight />
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton
							onClick={() => gotoPage(pageCount - 1)}
							disabled={!canNextPage}
							aria-label={t('page.last')}
							size="small"
						>
							<LastPage />
						</IconButton>
					</Grid>
				</Grid>
			)}
		</>
	);
}

ControlledTable.defaultProps = {
	hiddenColumns: [],
	renderRowSubComponent: null,
	size: 'medium',
	paginationEnabled: true,
	styling: undefined,
	tableLayoutStyle: 'fixed',
	hideHeader: false,
	setPageIndex: undefined,
	isLoading: false,
	tableWidth: 'fixed',
	tableCellFontWeight: 'normal',
	hasMobileView: true,
};
