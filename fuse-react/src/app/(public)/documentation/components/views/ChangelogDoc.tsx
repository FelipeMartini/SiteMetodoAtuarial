import Typography from '@mui/material/Typography';
import ChangelogCard from '../ui/changelog/ChangelogCard';
import changelogData from '../../lib/constants/changelogData';

/**
 * The changelog doc page.
 * Changelog records all notable changes made to Fuse React.
 */
function ChangelogDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Changelog
			</Typography>

			{changelogData.map((item) => (
				<ChangelogCard
					className="mb-6 w-full shrink-0"
					key={`changelog-${item.version}`}
					item={item}
				/>
			))}
		</>
	);
}

export default ChangelogDoc;
