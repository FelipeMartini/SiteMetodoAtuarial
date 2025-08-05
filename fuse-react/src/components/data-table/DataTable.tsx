import { MaterialReactTable, useMaterialReactTable, MaterialReactTableProps, MRT_Icons } from 'material-react-table';
import _ from 'lodash';
import { useMemo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Theme } from '@mui/material/styles';
import DataTableTopToolbar from './DataTableTopToolbar';
import { useThemeMediaQuery } from '@fuse/hooks';

const tableIcons: Partial<MRT_Icons> = {
	ArrowDownwardIcon: (props) => <FuseSvgIcon {...props}>lucide:arrow-down</FuseSvgIcon>,
	ClearAllIcon: () => <FuseSvgIcon>lucide:brush-cleaning</FuseSvgIcon>,
	DensityLargeIcon: () => <FuseSvgIcon>lucide:rows-2</FuseSvgIcon>,
	DensityMediumIcon: () => <FuseSvgIcon>lucide:rows-3</FuseSvgIcon>,
	DensitySmallIcon: () => <FuseSvgIcon>lucide:rows-4</FuseSvgIcon>,
	DragHandleIcon: () => <FuseSvgIcon>lucide:grip-vertical</FuseSvgIcon>,
	FilterListIcon: (props) => <FuseSvgIcon {...props}>lucide:list-filter</FuseSvgIcon>,
	FilterListOffIcon: () => <FuseSvgIcon>lucide:funnel</FuseSvgIcon>,
	FullscreenExitIcon: () => <FuseSvgIcon>lucide:log-in</FuseSvgIcon>,
	FullscreenIcon: () => <FuseSvgIcon>lucide:log-out</FuseSvgIcon>,
	SearchIcon: (props) => <FuseSvgIcon {...props}>lucide:search</FuseSvgIcon>,
	SearchOffIcon: () => <FuseSvgIcon>lucide:search-x</FuseSvgIcon>,
	ViewColumnIcon: () => <FuseSvgIcon>lucide:columns-3-cog</FuseSvgIcon>,
	MoreVertIcon: () => <FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>,
	MoreHorizIcon: () => <FuseSvgIcon>lucide:ellipsis</FuseSvgIcon>,
	SortIcon: (props) => <FuseSvgIcon {...props}>lucide:arrow-down-up</FuseSvgIcon>,
	PushPinIcon: (props) => <FuseSvgIcon {...props}>lucide:pin</FuseSvgIcon>,
	VisibilityOffIcon: () => <FuseSvgIcon>lucide:eye-off</FuseSvgIcon>
};

function DataTable<TData>(props: MaterialReactTableProps<TData>) {
	const { columns, data, ...rest } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const defaults = useMemo(
		() =>
			_.defaults(rest, {
				initialState: {
					density: 'compact',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: isMobile ? [] : ['mrt-row-expand', 'mrt-row-select'],
						right: isMobile ? [] : ['mrt-row-actions']
					},
					pagination: {
						pageSize: 15
					},
					enableFullScreenToggle: false
				},
				enableFullScreenToggle: false,
				enableColumnFilterModes: true,
				enableColumnOrdering: true,
				enableGrouping: true,
				enableColumnPinning: true,
				enableFacetedValues: true,
				enableRowActions: true,
				enableRowSelection: true,
				muiBottomToolbarProps: {
					className: 'flex items-center min-h-14 h-14'
				},
				muiTablePaperProps: {
					elevation: 0,
					square: true,
					className: 'flex flex-col flex-auto h-full'
				},
				muiTableContainerProps: {
					className: 'flex-auto'
				},
				enableStickyHeader: true,
				// enableStickyFooter: true,
				paginationDisplayMode: 'pages',
				positionToolbarAlertBanner: 'top',
				muiPaginationProps: {
					color: 'secondary',
					rowsPerPageOptions: [10, 20, 30],
					shape: 'rounded',
					variant: 'outlined',
					showRowsPerPage: false
				},
				muiSearchTextFieldProps: {
					placeholder: 'Search',
					sx: { minWidth: '300px' },
					variant: 'outlined',
					size: 'small'
				},
				muiFilterTextFieldProps: {
					variant: 'outlined',
					size: 'small',
					sx: {
						'& .MuiInputAdornment-root': {
							padding: 0,
							margin: 0
						},
						'& .MuiInputBase-root': {
							padding: 0
						},
						'& .MuiInputBase-input': {
							padding: 0
						}
					}
				},
				muiSelectAllCheckboxProps: {
					size: 'small'
				},
				muiSelectCheckboxProps: {
					size: 'small'
				},
				muiTableBodyRowProps: ({ row, table }) => {
					const { density } = table.getState();

					if (density === 'compact') {
						return {
							sx: {
								backgroundColor: 'initial',
								opacity: 1,
								boxShadow: 'none',
								height: row.getIsPinned() ? `${37}px` : undefined
							}
						};
					}

					return {
						sx: {
							backgroundColor: 'initial',
							opacity: 1,
							boxShadow: 'none',
							// Set a fixed height for pinned rows
							height: row.getIsPinned() ? `${density === 'comfortable' ? 53 : 69}px` : undefined
						}
					};
				},
				muiTableHeadCellProps: ({ column }) => ({
					sx: {
						'& .Mui-TableHeadCell-Content-Labels': {
							flex: 1,
							justifyContent: 'space-between'
						},
						'& .Mui-TableHeadCell-Content-Actions': {
							'& > button': {
								marginX: '2px'
							}
						},
						'& .MuiFormHelperText-root': {
							textAlign: 'center',
							marginX: 0,
							color: (theme: Theme) => theme.vars.palette.text.disabled,
							fontSize: 11
						},
						backgroundColor: (theme) =>
							column.getIsPinned() ? theme.vars.palette.background.paper : 'inherit'
					}
				}),
				mrtTheme: (theme) => ({
					baseBackgroundColor: theme.palette.background.paper,
					menuBackgroundColor: theme.palette.background.paper,
					pinnedRowBackgroundColor: theme.palette.background.paper,
					pinnedColumnBackgroundColor: theme.palette.background.paper
				}),
				renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
				icons: tableIcons,
				positionActionsColumn: 'last'
			} as Partial<MaterialReactTableProps<TData>>),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[rest]
	);

	const tableOptions = useMemo(
		() => ({
			columns,
			data,
			...defaults,
			...rest
		}),
		[columns, data, defaults, rest]
	);

	const tableInstance = useMaterialReactTable<TData>(tableOptions);

	return <MaterialReactTable table={tableInstance} />;
}

export default DataTable;
