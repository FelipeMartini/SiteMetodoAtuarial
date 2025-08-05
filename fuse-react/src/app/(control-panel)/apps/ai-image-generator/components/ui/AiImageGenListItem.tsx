import { Paper, ButtonGroup } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { AiImageGenItem } from '../../api/types';
import { useDeleteItem } from '../../api/hooks/items/useDeleteItem';
import { useUpdateItem } from '../../api/hooks/items/useUpdateItem';
import useAiImageGenAppContext from '../../contexts/AiImageGenAppContext/useAiImageGenAppContext';
import Tooltip from '@mui/material/Tooltip';

type AiImageGenListItemProps = {
	className?: string;
	item: AiImageGenItem;
};

function AiImageGenListItem(props: AiImageGenListItemProps) {
	const { item, className = '' } = props;
	const { setSelectedItem } = useAiImageGenAppContext();

	const { mutate: remove } = useDeleteItem();
	const { mutate: update } = useUpdateItem();

	function handleInfo() {
		setSelectedItem(item);
	}

	function handleRemove() {
		remove(item.id);
	}

	function handleDownload() {
		const downloadLink = document.createElement('a');
		downloadLink.href = item.response?.data[0]?.url;
		downloadLink.download = `${item.formData?.prompt?.slice(0, 30)}.png`;
		downloadLink.click();
		downloadLink.remove();
	}

	function handleToggleFavorite() {
		update({ ...item, favorite: !item.favorite });
	}

	return (
		<Paper
			className={clsx('group relative min-h-30 lg:min-h-50', className)}
			sx={{
				aspectRatio: item.formData?.size.replace('x', '/'),
				background: `url(${item.response?.data[0]?.url}) no-repeat center center / cover`
			}}
		>
			{item.favorite && <FuseSvgIcon className="absolute top-2 right-2 text-red-500">lucide:heart</FuseSvgIcon>}

			{item.sourceImageUrl && (
				<Tooltip title="Modified from source image">
					<FuseSvgIcon className="absolute top-2 left-2 rounded-full bg-white/30 p-1 text-blue-500">
						lucide:imagegraph
					</FuseSvgIcon>
				</Tooltip>
			)}

			<div className="absolute inset-0 flex items-end justify-center rounded-lg bg-black/0 pb-3 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100 sm:items-center sm:pb-0 sm:opacity-0">
				<ButtonGroup
					variant="contained"
					sx={{
						backgroundColor: (theme) => theme.vars.palette.background.paper,
						color: (theme) => theme.vars.palette.text.primary
					}}
				>
					<IconButton onClick={handleInfo}>
						<FuseSvgIcon>lucide:info</FuseSvgIcon>
					</IconButton>
					<IconButton onClick={handleDownload}>
						<FuseSvgIcon>lucide:cloud-download</FuseSvgIcon>
					</IconButton>
					<IconButton onClick={handleToggleFavorite}>
						<FuseSvgIcon>{item.favorite ? 'lucide:heart' : 'lucide:heart'}</FuseSvgIcon>
					</IconButton>
					<IconButton onClick={handleRemove}>
						<FuseSvgIcon>lucide:trash</FuseSvgIcon>
					</IconButton>
				</ButtonGroup>
			</div>
		</Paper>
	);
}

export default AiImageGenListItem;
