import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FuseHighlight from '@fuse/core/FuseHighlight';
import { SimpleEditor } from '@/components/tiptap/tiptap-templates/simple/simple-editor';

type FormData = {
	content: string;
	format: 'html' | 'json';
};

function TiptapEditorDemo() {
	const { control, handleSubmit, reset, watch } = useForm<FormData>({
		mode: 'all',
		defaultValues: {
			content: ''
		}
	});

	const contentValue = watch('content');

	const onSubmit = (data: FormData) => {
		// eslint-disable-next-line no-console
		console.log('Form submitted:', data);
	};

	return (
		<Box className="w-full">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="content"
					control={control}
					rules={{ required: 'Content is required' }}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<>
							<SimpleEditor
								onChange={onChange}
								value={value}
								error={error?.message}
							/>
						</>
					)}
				/>

				<Stack
					direction="row"
					spacing={2}
					sx={{ mt: 2 }}
				>
					<Button
						variant="contained"
						color="primary"
						type="submit"
					>
						Submit
					</Button>
					<Button
						variant="outlined"
						onClick={() => reset()}
					>
						Reset
					</Button>
				</Stack>

				{contentValue && contentValue !== '' && (
					<FuseHighlight
						component="pre"
						className="language-json mt-4 w-full"
						copy={false}
					>
						{contentValue}
						{/* {htmlJsonFormat === 'html' ? contentValue : JSON.stringify(JSON.parse(contentValue), null, 2)} */}
					</FuseHighlight>
				)}
			</form>
		</Box>
	);
}

export default TiptapEditorDemo;
