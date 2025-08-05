import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CommentModel from '../../../../../api/models/CommentModel';
import { ScrumboardComment } from '../../../../../api/types';
import { useGetScrumboardMember } from '../../../../../api/hooks/members/useGetScrumboardMember';

/**
 * Form Validation Schema
 */
const schema = z.object({
	message: z.string().nonempty('You must enter a comment')
});

type FormType = z.infer<typeof schema>;

const defaultValues = {
	idMember: 'baa88231-0ee6-4028-96d5-7f187e0f4cd5',
	message: ''
};

type CardCommentProps = {
	onCommentAdd: (comment: ScrumboardComment) => void;
};

/**
 * The card comment component.
 */
function CardComment(props: CardCommentProps) {
	const { onCommentAdd } = props;
	const { data: user } = useGetScrumboardMember(defaultValues.idMember);

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(data: FormType) {
		onCommentAdd(CommentModel({ ...defaultValues, ...data }));
		reset(defaultValues);
	}

	if (!user) {
		return null;
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="-mx-2 flex"
		>
			<Avatar
				className="mx-2 h-8 w-8"
				alt={user.name}
				src={user.avatar}
			/>
			<div className="mx-2 flex flex-1 flex-col items-start">
				<Controller
					name="message"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="flex flex-1"
							fullWidth
							error={!!errors.message}
							helperText={errors?.message?.message}
							rows={3}
							variant="outlined"
							label="Add comment"
							placeholder="Write a comment..."
						/>
					)}
				/>

				<Button
					className="mt-4"
					aria-label="save"
					variant="contained"
					color="secondary"
					type="submit"
					size="small"
					disabled={_.isEmpty(dirtyFields) || !isValid}
				>
					Save
				</Button>
			</div>
		</form>
	);
}

export default CardComment;
