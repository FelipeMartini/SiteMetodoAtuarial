'use client';

import FuseUtils from '@fuse/utils';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Masonry from '@mui/lab/Masonry';
import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import NoteListItem from '../ui/NoteListItem';
import { NotesNote, RouteParams } from '../../api/types';
import { useNotesList } from '../../api/hooks/notes/useNotesList';
import { useNotesAppContext } from '../../contexts/NotesAppContext/useNotesAppContext';

/**
 * The note list view.
 */
function NoteListView() {
	const routeParams = useParams<RouteParams>();
	const { data: notes, isLoading } = useNotesList();

	const { searchText } = useNotesAppContext();

	const [filteredData, setFilteredData] = useState<NotesNote[]>([]);

	useEffect(() => {
		function filterData() {
			let data = notes;

			if (searchText?.length === 0) {
				return data;
			}

			data = FuseUtils.filterArrayByString(data, searchText);

			return data;
		}

		if (notes?.length > 0) {
			setFilteredData(filterData());
		}
	}, [notes, searchText, routeParams]);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!filteredData || filteredData.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<Typography className="text-lg font-medium">There are no notes!</Typography>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-wrap">
			<Masonry
				columns={{
					xs: 1,
					sm: 2,
					md: 3,
					lg: 4,
					xl: 5,
					xxl: 6
				}}
				spacing={2}
				className="my-masonry-grid flex w-full"
			>
				{filteredData.map((note) => (
					<NoteListItem
						key={note.id}
						note={note}
						className="w-full rounded-lg border"
					/>
				))}
			</Masonry>
		</div>
	);
}

export default NoteListView;
