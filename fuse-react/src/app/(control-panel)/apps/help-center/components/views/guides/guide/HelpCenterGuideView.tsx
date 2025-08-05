'use client';

import useParams from '@fuse/hooks/useParams';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import DemoContent from '@fuse/core/DemoContent';
import { useGuide } from '../../../../api/hooks/guides/useGuide';

/**
 * The help center guide.
 */
function HelpCenterGuideView() {
	const routeParams = useParams();
	const { guideId } = routeParams as { guideId: string };

	const { data: guide } = useGuide(guideId);

	if (!guide) {
		return null;
	}

	return (
		<div className="container flex flex-col items-center p-4">
			<div className="flex w-full max-w-6xl flex-col">
				<PageBreadcrumb className="mb-2" />
				<div className="text-3xl leading-[1.25] font-semibold tracking-tight">{guide.title}</div>

				<Typography
					className="text-xl tracking-tight"
					color="text.secondary"
				>
					{guide.subtitle}
				</Typography>

				<div
					className="prose dark:prose-invert mt-8 max-w-none"
					dangerouslySetInnerHTML={{ __html: guide.content }}
				/>

				<DemoContent />

				<div className="mt-10 flex flex-col border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
					<Typography
						className="text-sm font-medium"
						color="text.secondary"
					>
						Last updated 2 months ago
					</Typography>
					<div className="mt-2 flex items-center sm:mt-0">
						<Typography
							className="mx-2 font-medium"
							color="text.secondary"
						>
							Was this page helpful?
						</Typography>
						<IconButton>
							<FuseSvgIcon>lucide:thumbs-up</FuseSvgIcon>
						</IconButton>
						<IconButton>
							<FuseSvgIcon>lucide:thumbs-down</FuseSvgIcon>
						</IconButton>
					</div>
				</div>

				<Card className="mt-8 flex items-center justify-between rounded-xl p-6 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-lg sm:px-10">
					<div>
						<Typography color="text.secondary">Next</Typography>
						<Typography className="text-lg font-semibold">Removing a media from a project</Typography>
					</div>
					<FuseSvgIcon className="ml-3">lucide:arrow-right</FuseSvgIcon>
				</Card>
			</div>
		</div>
	);
}

export default HelpCenterGuideView;
