import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ChangeEvent } from 'react';

type NoteFormUploadImageProps = {
	onChange: (T: string) => void;
};

/**
 * The note form upload image.
 */
function NoteFormUploadImage(props: NoteFormUploadImageProps) {
	const { onChange } = props;

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.readAsBinaryString(file);

		reader.onload = () => {
			if (onChange) {
				onChange(`data:${file.type};base64,${btoa(reader.result as string)}`);
			}
		};

		reader.onerror = () => {
			// eslint-disable-next-line no-console
			console.log('error on load image');
		};
	}

	return (
		<label htmlFor="button-file">
			<input
				accept="image/*"
				className="hidden"
				id="button-file"
				type="file"
				onChange={handleChange}
			/>
			<IconButton
				className="mx-1 h-8 w-8 p-0"
				component="span"
				size="large"
			>
				<FuseSvgIcon>lucide:image</FuseSvgIcon>
			</IconButton>
		</label>
	);
}

export default NoteFormUploadImage;
