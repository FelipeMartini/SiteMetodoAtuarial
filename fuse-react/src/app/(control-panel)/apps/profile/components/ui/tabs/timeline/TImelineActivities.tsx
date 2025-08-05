import FuseLoading from '@fuse/core/FuseLoading';
import List from '@mui/material/List';
import { useProfileActivities } from '../../../../api/hooks/useProfileActivities';
import TimelineActivityItem from './TimelineActivityItem';

function TImelineActivities() {
	const { data: activities, isLoading } = useProfileActivities();

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<List className="p-0">
			{activities.map((activity) => (
				<TimelineActivityItem
					item={activity}
					key={activity.id}
				/>
			))}
		</List>
	);
}

export default TImelineActivities;
