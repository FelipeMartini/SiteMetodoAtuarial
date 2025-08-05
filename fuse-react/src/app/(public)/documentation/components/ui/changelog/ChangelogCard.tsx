'use client';

import Card from '@mui/material/Card';
import { alpha, styled } from '@mui/material/styles';
import { blue, green, red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { ChangelogItemType } from '../../../lib/constants/changelogData';

const StyledBadge = styled('div')<{ value: string }>(({ value }) => ({
	display: 'inline-flex',
	fontSize: 14,
	fontWeight: 700,
	color: '#FFF',

	// letterSpacing: '.015em',
	lineHeight: 1,
	padding: '4px 12px',
	borderRadius: 4,

	...(value === 'new' && {
		backgroundColor: green[50],
		color: alpha(green[500], 0.8)
	}),
	...(value === 'fix' && {
		backgroundColor: blue[50],
		color: alpha(blue[500], 0.8)
	}),
	...(value === 'breaking' && {
		backgroundColor: red[50],
		color: alpha(red[500], 0.8)
	})
}));

type ChangelogCardProps = {
	className?: string;
	item?: ChangelogItemType;
};

/**
 * The changelog card.
 */
function ChangelogCard(props: ChangelogCardProps) {
	const { className, item, ...rest } = props;
	const { version, date, newChanges, fixedChanges, breakingChanges, notes } = item || {};

	return (
		<Card
			className={clsx('not-prose px-8 py-6 shadow-sm', className)}
			{...rest}
		>
			<div className="flex items-center">
				{version && (
					<Typography
						className="text-3xl font-bold"
						component="h2"
					>{`v${version}`}</Typography>
				)}
				{date && (
					<Typography
						className="mx-2 text-xl font-semibold"
						color="text.secondary"
						component="h3"
					>
						({date})
					</Typography>
				)}
			</div>
			{newChanges?.length > 0 && (
				<div className="mt-10">
					<StyledBadge value="new">New</StyledBadge>
					<ul className="my-4 list-disc px-6">
						{newChanges.map((change, index: number) => (
							<li
								key={`${version}-new-${index}`}
								className="mb-1.5"
							>
								<Typography>{change}</Typography>
							</li>
						))}
					</ul>
				</div>
			)}
			{fixedChanges?.length > 0 && (
				<div className="mt-10">
					<StyledBadge value="fix">Fixed</StyledBadge>
					<ul className="my-4 list-disc px-6">
						{fixedChanges.map((change, index: number) => (
							<li
								key={`${version}-fix-${index}`}
								className="mb-1.5"
							>
								<Typography>{change}</Typography>
							</li>
						))}
					</ul>
				</div>
			)}
			{breakingChanges?.length > 0 && (
				<div className="mt-10">
					<StyledBadge value="breaking">Breaking Changes</StyledBadge>
					<ul className="my-4 list-disc px-6">
						{breakingChanges.map((change, index: number) => (
							<li
								key={`${version}-breaking-${index}`}
								className="mb-1.5"
							>
								<Typography>{change}</Typography>
							</li>
						))}
					</ul>
				</div>
			)}

			{notes}
		</Card>
	);
}

export default ChangelogCard;
