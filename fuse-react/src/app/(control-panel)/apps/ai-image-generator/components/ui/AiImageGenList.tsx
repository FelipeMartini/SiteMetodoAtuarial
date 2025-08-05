import { Typography } from '@mui/material';
import _ from 'lodash';
import { AiImageGenItem } from '../../api/types';
import AiImageGenListItem from './AiImageGenListItem';

type AiImageGenListProps = {
	items: AiImageGenItem[];
};

function AiImageGenList(props: AiImageGenListProps) {
	const { items } = props;

	if (items?.length === 0) {
		return (
			<Typography className="flex h-full min-h-full items-center justify-center text-center text-gray-500">
				No images generated yet. Start by entering a prompt!
			</Typography>
		);
	}

	return (
		<div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
			{_.sortBy(items, (item) => item?.response?.created)
				.reverse()
				.map((image) => (
					<AiImageGenListItem
						className="col-span-1 flex w-full"
						key={image.id}
						item={image}
					/>
				))}
		</div>
	);
}

export default AiImageGenList;
