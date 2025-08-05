import { useState, useMemo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import { Tabs, Tab, IconButton } from '@mui/material';
import GeneratedImagesList from '../ui/AiImageGenList';
import { useItems } from '../../api/hooks/items/useItems';
import AiImageGenItemInfoDialog from '../dialogs/item-info/AiImageGenItemInfoDialog';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ConfigDialog from '../dialogs/config/AiImageGenConfigDialog';

const tabValues = [
	{
		label: 'All',
		value: 'all',
		icon: null
	},
	{
		label: 'Favorites',
		value: 'favorites',
		icon: 'lucide:heart'
	}
];

type AiImageGenContentProps = {
	onSetSidebarOpen: (open: boolean) => void;
};

function AiImageGenContent(props: AiImageGenContentProps) {
	const { onSetSidebarOpen } = props;
	const [tabValue, setTabValue] = useState(0);
	const { data, isLoading } = useItems();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const items = useMemo(() => _.filter(data, (item) => (tabValue === 1 ? item.favorite : true)), [data, tabValue]);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<div className="h-full w-full px-4 py-4">
			<div className="mb-4 flex w-full items-center justify-between">
				<div className="flex items-center gap-2">
					{isMobile && (
						<IconButton
							onClick={() => onSetSidebarOpen(true)}
							aria-label="open left sidebar"
							className="border-divider rounded-md border"
						>
							<FuseSvgIcon>lucide:menu</FuseSvgIcon>
						</IconButton>
					)}
					<Tabs
						value={tabValue}
						onChange={(_ev, value: number) => setTabValue(value)}
					>
						{tabValues.map((tab) => (
							<Tab
								key={tab.value}
								label={tab.label}
								icon={<FuseSvgIcon>{tab.icon}</FuseSvgIcon>}
								iconPosition="start"
							/>
						))}
					</Tabs>
				</div>
				<ConfigDialog />
			</div>

			<GeneratedImagesList items={items} />

			<AiImageGenItemInfoDialog />
		</div>
	);
}

export default AiImageGenContent;
