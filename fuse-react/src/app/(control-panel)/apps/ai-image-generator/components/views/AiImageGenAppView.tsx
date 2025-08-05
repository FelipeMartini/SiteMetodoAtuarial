'use client';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { CircularProgress, Backdrop } from '@mui/material';
import AiImageGenSidebarContent from '../ui/AiImageGenSidebarContent';
import AiImageGenContent from '../ui/AiImageGenContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { AiImageGenAppContextProvider } from '../../contexts/AiImageGenAppContext/AiImageGenAppContextProvider';
import { useAiImageGenAppContext } from '../../contexts/AiImageGenAppContext/useAiImageGenAppContext';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2,
		paddingLeft: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2],
		borderRadius: '12px 0 0 0',
		[theme.breakpoints.down('md')]: {
			borderRadius: '12px 12px 0 0'
		},
		backgroundColor: theme.vars.palette.background.paper
	},
	'& .FusePageSimple-sidebarWrapper': {
		border: 'none'
	},
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.default,
		maxHeight: '100%'
	}
}));

function AiImageGenAppView() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const { loading } = useAiImageGenAppContext();

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile && loading) {
			setLeftSidebarOpen(false);
		}
	}, [isMobile, loading]);

	return (
		<>
			<Root
				content={<AiImageGenContent onSetSidebarOpen={setLeftSidebarOpen} />}
				leftSidebarProps={{
					open: leftSidebarOpen,
					onClose: () => {
						setLeftSidebarOpen(false);
					},
					content: <AiImageGenSidebarContent />,
					width: 320
				}}
				scroll={isMobile ? 'page' : 'content'}
			/>

			<Backdrop
				open={loading}
				className="z-50"
			>
				<CircularProgress color="secondary" />
			</Backdrop>
		</>
	);
}

const AiImageGenAppWrapper = () => {
	return (
		<AiImageGenAppContextProvider>
			<AiImageGenAppView />
		</AiImageGenAppContextProvider>
	);
};

export default AiImageGenAppWrapper;
