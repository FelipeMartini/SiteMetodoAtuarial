'use client';

import Typography from '@mui/material/Typography';
import { darken, lighten, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { SyntheticEvent, useState } from 'react';
import Paper from '@mui/material/Paper';
import _ from 'lodash';
import Button from '@mui/material/Button';
import Link from '@fuse/core/Link';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import GlobalStyles from '@mui/material/GlobalStyles';
import { LayoutOptionType } from '../../../types/PageLayoutOverviewsType';
import { Tabs, Tab } from '@mui/material';

const Root = styled('div')(() => ({
	'& .FusePageSimple-header': {},
	'& .FusePageSimple-wrapper': {
		position: 'relative'
	},

	'&.scroll-normalScroll': {
		'& .preview-wrapper': {
			overflow: 'auto'
		},

		'& .preview-component': {
			minHeight: 'auto'
		}
	},
	'&.scroll-pageScroll': {
		'& .preview-component': {
			minHeight: '0',
			overflow: 'auto',
			'& .FusePageSimple-root': {
				minHeight: 'auto'
			},
			'& .FusePageCarded-root': {
				minHeight: 'auto'
			}
		}
	},
	'&.scroll-contentScroll': {
		'& .preview-component': {
			minHeight: '0'
		}
	}
}));

type PageLayoutOverviewProps = {
	layoutOptions: LayoutOptionType;
};

/**
 * The PageLayoutOverview page.
 */
function PageLayoutOverview(props: PageLayoutOverviewProps) {
	const { layoutOptions } = props;

	const { title, description, availableOptions = [], selectedOption: defaultSelectedOption, options } = layoutOptions;

	const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);

	const SelectedComponent = options[selectedOption]?.component ? options[selectedOption]?.component : () => null;

	function handleTabChange(_ev: SyntheticEvent, val: number) {
		setSelectedOption(availableOptions[val].value);
	}

	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#fuse-main': {
						height: 'auto!important',
						overflow: 'auto!important'
					}
				})}
			/>
			<Root className={`scroll-${selectedOption}`}>
				<div className="mb-6 flex flex-col">
					<Typography className="mb-1 text-4xl leading-none font-extrabold tracking-tight">
						{title}
					</Typography>
					<Typography
						className="text-lg"
						color="text.secondary"
					>
						{description}
					</Typography>

					<div className="mt-6">
						<Tabs
							value={availableOptions.indexOf(_.find(availableOptions, { value: selectedOption }))}
							onChange={handleTabChange}
						>
							{availableOptions.map((option) => (
								<Tab
									key={option.value}
									label={option.title}
								/>
							))}
						</Tabs>
					</div>
				</div>
				<div className="w-full">
					<Paper className="preview-wrapper relative z-20 flex h-192 min-h-full w-full flex-auto rounded-xl border shadow-xl">
						<Box
							className="preview-navbar sticky top-0 z-20 hidden h-192 min-w-40 shrink-0 border-r p-4 md:block"
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.4)
								})
							})}
						>
							<div className="flex flex-col gap-3">
								<Box
									className="h-3 w-2/3 rounded-sm"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.1)
									}}
								/>

								<Box
									className="h-3 w-3/4 rounded-sm"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.1)
									}}
								/>
								<Box
									className="h-3 w-1/2 rounded-sm"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.1)
									}}
								/>
								<Box
									className="h-3 w-2/3 rounded-sm"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.1)
									}}
								/>
							</div>
						</Box>

						<div className="flex flex-auto flex-col">
							<Box
								className="preview-header relative z-20 flex h-12 shrink-0 items-center justify-end border-b px-4"
								sx={(theme) => ({
									backgroundColor: lighten(theme.palette.background.default, 0.02),
									...theme.applyStyles('light', {
										backgroundColor: lighten(theme.palette.background.default, 0.4)
									})
								})}
							>
								<Box
									className="h-6 w-6 rounded-full"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.1)
									}}
								/>
							</Box>

							<div className="preview-component relative z-10 flex flex-auto flex-col">
								<SelectedComponent />
							</div>

							<Box
								className="preview-footer relative z-20 flex h-14 shrink-0 items-center border-t px-6 sm:px-10"
								sx={(theme) => ({
									backgroundColor: lighten(theme.palette.background.default, 0.02),
									...theme.applyStyles('light', {
										backgroundColor: lighten(theme.palette.background.default, 0.4)
									})
								})}
							>
								<Box
									className="h-4 w-32 rounded-full"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.1)
									}}
								/>
							</Box>
						</div>
					</Paper>

					<div className="my-8 flex items-center justify-between">
						<div>
							<Typography>{options[selectedOption].description}</Typography>
							<Typography
								component="code"
								className="text-md mt-1"
							>
								{options[selectedOption].link}/
							</Typography>
						</div>
						{options[selectedOption]?.link && (
							<Button
								color="secondary"
								variant="contained"
								component={Link}
								to={options[selectedOption].link}
								startIcon={<FuseSvgIcon>lucide:external-link</FuseSvgIcon>}
							>
								View
							</Button>
						)}
					</div>
				</div>
			</Root>
		</>
	);
}

export default PageLayoutOverview;
