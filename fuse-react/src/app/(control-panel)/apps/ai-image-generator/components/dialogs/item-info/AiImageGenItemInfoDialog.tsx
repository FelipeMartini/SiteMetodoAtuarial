import { Dialog, DialogTitle, DialogContent, Typography, Card, CardMedia, IconButton, Divider } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useAiImageGenAppContext from '../../../contexts/AiImageGenAppContext/useAiImageGenAppContext';

function AiImageGenItemInfoDialog() {
	const { setSelectedItem, selectedItem } = useAiImageGenAppContext();

	if (!selectedItem) return null;

	const {
		response,
		formData: { prompt, negativePrompt, size, artStyle, style, mood, lighting, quality } = {},
		sourceImageUrl
	} = selectedItem;

	const imageUrl = response?.data?.[0]?.url;
	const revisedPrompt = response?.data?.[0]?.revised_prompt;
	const created = response?.created;

	return (
		<Dialog
			open={!!selectedItem}
			onClose={() => setSelectedItem(null)}
			maxWidth="lg"
			fullWidth
		>
			<IconButton
				className="absolute top-1 right-1"
				onClick={() => setSelectedItem(null)}
			>
				<FuseSvgIcon>lucide:x</FuseSvgIcon>
			</IconButton>

			<DialogTitle className="text-lg">Image Details</DialogTitle>

			<DialogContent>
				<div className="grid min-h-[70vh] gap-6 md:grid-cols-3">
					<div className="col-span-2 grid items-start">
						{/* Generated Image */}
						{imageUrl && (
							<>
								<Typography
									variant="subtitle1"
									className="mb-2 font-medium"
								>
									{sourceImageUrl ? 'Generated Image (Result)' : 'Generated Image'}
								</Typography>
								<Card className="mb-4">
									<CardMedia
										component="img"
										image={imageUrl}
										alt={prompt}
									/>
								</Card>
							</>
						)}

						{/* Source Image - Only show if available */}
						{sourceImageUrl && (
							<>
								<Divider className="my-4" />
								<Typography
									variant="subtitle1"
									className="mb-2 font-medium"
								>
									Source Image
								</Typography>
								<Card>
									<CardMedia
										component="img"
										image={sourceImageUrl}
										alt="Source Image"
									/>
								</Card>
							</>
						)}
					</div>

					<div className="col-span-1 flex flex-col">
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								{prompt && (
									<Typography>
										<strong>{sourceImageUrl ? 'Modification Instructions:' : 'Prompt:'}</strong>{' '}
										{prompt}
									</Typography>
								)}
								{revisedPrompt && (
									<Typography>
										<strong>Revised Prompt:</strong> {revisedPrompt}
									</Typography>
								)}
								{negativePrompt && (
									<Typography>
										<strong>Negative Prompt:</strong> {negativePrompt}
									</Typography>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<Typography className="text-lg font-bold">Image Settings</Typography>
								{size && (
									<Typography>
										<strong>Size:</strong> {size}
									</Typography>
								)}
								{artStyle && (
									<Typography>
										<strong>Art Style:</strong> {artStyle}
									</Typography>
								)}
								{style && (
									<Typography>
										<strong>Style:</strong> {style}
									</Typography>
								)}
								{mood && (
									<Typography>
										<strong>Mood:</strong> {mood}
									</Typography>
								)}
								{lighting && (
									<Typography>
										<strong>Lighting:</strong> {lighting}
									</Typography>
								)}
								{quality && (
									<Typography>
										<strong>Quality:</strong> {quality}
									</Typography>
								)}
							</div>

							{created && (
								<Typography variant="body2">
									<strong>Created:</strong> {new Date(created * 1000).toLocaleString()}
								</Typography>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default AiImageGenItemInfoDialog;
