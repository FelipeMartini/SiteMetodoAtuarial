'use client';

import Typography from '@mui/material/Typography';
import { RedocStandalone } from 'redoc';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { RedocRawOptions } from 'redoc/typings/services/RedocNormalizedOptions';
import mockApiJson from 'src/@mock-utils/mockOpenApiSpecs.json';

const Root = styled('div')(() => ({
	'& .menu-content': {
		top: '64px!important',
		bottom: 64,
		height: 'calc(100vh - 128px)!important'
	}
}));

/**
 * Mock API Doc
 * This document provides information on how to use the mock API.
 */
function MockApiDoc() {
	return (
		<Root className="w-full">
			<Typography
				variant="h4"
				className="mb-8 font-bold"
			>
				Mock API Definitions (OpenAPI 3.0)
			</Typography>
			<Paper className="not-prose sticky top-0 w-full shadow-sm">
				<RedocStandalone
					spec={mockApiJson as object}
					options={
						{
							layout: 'stacked',
							hideHostname: true,
							hideInfoSection: true,
							hideInfoDescription: true,
							hideDownloadButton: true,
							noAutoAuth: true,
							hideLoading: true,
							nativeScrollbars: true,
							expandResponses: '',
							jsonSampleExpandLevel: 1,
							sortOperationsAlphabetically: true,
							sortPropsAlphabetically: true,
							sortTagsAlphabetically: true,
							pathInMiddlePanel: true
						} as RedocRawOptions
					}
				/>
			</Paper>
		</Root>
	);
}

export default MockApiDoc;
