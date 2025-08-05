import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * FuseScrollbars Doc
 * This document provides information on how to use the FuseScrollbars.
 */
function FuseScrollbarsDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FuseScrollbars
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseScrollbars</code> is a simple{' '}
				<a
					href="http://utatti.github.io/perfect-scrollbar/"
					target="_blank"
					rel="noreferrer noopener"
				>
					perfect-scrollbar
				</a>{' '}
				component for react.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				It can be disabled globally by Fuse Settings (<code>src/configs/settingsConfig.tsx</code>).
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{`
                                <FuseScrollbars className={classes.content}>
                                    Content
                                </FuseScrollbars>
                                `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Props
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{`
                               {
                                    className               : '',
                                    enable                  : true,
                                    scrollToTopOnChildChange: false,
                                    scrollToTopOnRouteChange: false,
                                    option                  : {
                                        wheelPropagation: true
                                    },
                                    ref                     : undefined,
                                    onScrollY               : undefined,
                                    onScrollX               : undefined,
                                    onScrollUp              : undefined,
                                    onScrollDown            : undefined,
                                    onScrollLeft            : undefined,
                                    onScrollRight           : undefined,
                                    onYReachStart           : undefined,
                                    onYReachEnd             : undefined,
                                    onXReachStart           : undefined,
                                    onXReachEnd             : undefined
                                };
                                `}
			</FuseHighlight>
		</>
	);
}

export default FuseScrollbarsDoc;
