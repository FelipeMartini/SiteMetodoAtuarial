import { darken, lighten } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import _ from 'lodash';
import { Course } from '../../api/types';
import { useCategories } from '../../api/hooks/categories/useCategories';

type CourseCategoryProps = {
	slug: Course['slug'];
};

/**
 * The CourseCategory component.
 */
function CourseCategory(props: CourseCategoryProps) {
	const { slug } = props;

	const { data: categories } = useCategories();

	const category = _.find(categories, { slug });

	if (!category) {
		return null;
	}

	return (
		<Chip
			className="text-md font-semibold"
			label={category?.title}
			sx={(theme) => ({
				color: lighten(category?.color, 0.8),
				backgroundColor: darken(category?.color, 0.1),
				...theme.applyStyles('light', {
					color: darken(category?.color, 0.4),
					backgroundColor: lighten(category?.color, 0.8)
				})
			})}
			size="small"
		/>
	);
}

export default CourseCategory;
