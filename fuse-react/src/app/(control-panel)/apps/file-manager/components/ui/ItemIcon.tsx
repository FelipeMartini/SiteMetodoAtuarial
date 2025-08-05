import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { amber, blue, green, grey, red } from '@mui/material/colors';

const TypeBadge = styled(Box)(({ ...props }) => ({
	backgroundColor: {
		PDF: red[600],
		DOC: blue[600],
		XLS: green[600],
		TXT: grey[600],
		JPG: amber[600]
	}[props.color as string]
}));

type ItemIconProps = {
	type: string;
	size?: number;
};

/**
 * The item icon component.
 */
function ItemIcon(props: ItemIconProps) {
	const { type, size = 40 } = props;

	if (type === 'folder') {
		return (
			<FuseSvgIcon
				size={size}
				color="disabled"
			>
				lucide:folder
			</FuseSvgIcon>
		);
	}

	return (
		<div className="relative">
			<FuseSvgIcon
				size={size}
				color="disabled"
			>
				lucide:file-text
			</FuseSvgIcon>
			<TypeBadge
				color={type}
				className="absolute bottom-0 left-0 rounded-sm px-1 text-xs leading-normal font-semibold text-white"
			>
				{type}
			</TypeBadge>
		</div>
	);
}

export default ItemIcon;
