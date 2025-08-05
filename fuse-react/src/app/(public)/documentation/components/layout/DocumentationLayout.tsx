'use client';

import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import FuseNavigation from '@fuse/core/FuseNavigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FusePageSimple from '@fuse/core/FusePageSimple';
import usePathname from '@fuse/hooks/usePathname';
import { Button } from '@mui/material';
import Link from '@fuse/core/Link';
import PurchaseButton from 'src/components/theme-layouts/components/PurchaseButton';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import documentationNavigation from '../../lib/constants/documentationNavigation';
import DocumentationSidebarHeader from './DocumentationSidebarHeader';

const Root = styled(FusePageSimple)(() => ({
	'& [class^="language-"]': {
		margin: 0
	}
}));

type DocumentationLayoutProps = {
	children?: React.ReactNode;
};

/**
 * Documentation Layout
 */
function DocumentationLayout(props: DocumentationLayoutProps) {
	const { children } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const pathname = usePathname();
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			setLeftSidebarOpen(false);
		}
	}, [pathname, isMobile]);

	return (
		<Root
			header={
				<div className="flex h-16 max-w-full flex-col items-start justify-center px-3 sm:flex-row sm:items-center">
					<div className="flex flex-1 items-center">
						<IconButton
							onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
							aria-label="toggle left sidebar"
						>
							<FuseSvgIcon>lucide:menu</FuseSvgIcon>
						</IconButton>

						<PageBreadcrumb
							skipHome
							maxItems={isMobile ? 2 : 5}
						/>
					</div>
					<div className="flex shrink items-center justify-end gap-2">
						<PurchaseButton size="small">Purchase</PurchaseButton>
						<Button
							className="whitespace-nowrap"
							component={Link}
							to="/"
							variant="contained"
							startIcon={<FuseSvgIcon>lucide:corner-up-left</FuseSvgIcon>}
							color="primary"
							size="small"
						>
							Back to the Dashboard
						</Button>
					</div>
				</div>
			}
			content={
				<div className="flex min-h-full flex-auto flex-col p-4 md:p-6">
					<div className="prose dark:prose-invert relative flex max-w-6xl flex-1 flex-col pb-8">
						{children}
					</div>
				</div>
			}
			leftSidebarProps={{
				content: (
					<div className="px-1 py-4">
						<DocumentationSidebarHeader className="mb-4 px-4" />
						<FuseNavigation
							className={clsx('navigation')}
							navigation={documentationNavigation.children}
						/>
					</div>
				),
				open: leftSidebarOpen,
				onClose: () => setLeftSidebarOpen(false),
				width: 288
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

export default DocumentationLayout;
