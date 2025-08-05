import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The typography page.
 */
function TypographyUI() {
	return (
		<>
			<div className="mb-10 flex shrink-0 flex-col sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 flex-1">
					<Typography
						variant="h4"
						className="font-bold"
					>
						Typography
					</Typography>
				</div>
				<div>
					<Button
						className="not-prose mt-3 sm:mt-0"
						variant="contained"
						color="secondary"
						component="a"
						href="https://mui.com/components/typography"
						target="_blank"
						role="button"
						startIcon={<FuseSvgIcon>lucide:external-link</FuseSvgIcon>}
					>
						Official docs
					</Button>
				</div>
			</div>
			<div className="flex w-full flex-auto flex-col gap-12">
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="h1">Display 4</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="h1">Display 4</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="h2">Display 3</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="h2">Display 3</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="h3">Display 2</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="h3">Display 2</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="h4">Display 1</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="h4">Display 1</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="h5">Headline</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="h5">Headline</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="h6">Title</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="h6">Title</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="subtitle1">Subheading</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="subtitle1">Subheading</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="body1">Body 2</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="body1">Body 2</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="body2">Body 1</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="body2">Body 1</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="caption">Caption</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="caption">Caption</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography
							gutterBottom
							noWrap
						>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
							ut labore et dolore magna aliqua.
						</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography noWrap>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex w-full sm:w-1/2">
						<Typography variant="button">Button</Typography>
					</div>
					<div className="flex w-full sm:w-1/2">
						<FuseHighlight
							component="pre"
							className="language-html w-full"
						>
							{`
                <Typography variant="button">Button</Typography>
              `}
						</FuseHighlight>
					</div>
				</div>
			</div>
		</>
	);
}

export default TypographyUI;
