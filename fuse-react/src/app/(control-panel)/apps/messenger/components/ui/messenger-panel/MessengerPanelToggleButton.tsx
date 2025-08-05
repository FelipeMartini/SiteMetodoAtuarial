import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useMessengerPanelContext } from '../../../contexts/MessengerPanelContext/useMessengerPanelContext';

type ChatPanelToggleButtonProps = {
	children?: React.ReactNode;
};

/**
 * The chat panel toggle button.
 */
function MessengerPanelToggleButton(props: ChatPanelToggleButtonProps) {
	const { children = <FuseSvgIcon>lucide:message-square-text</FuseSvgIcon> } = props;
	const { toggleChatPanel } = useMessengerPanelContext();

	return <IconButton onClick={() => toggleChatPanel()}>{children}</IconButton>;
}

export default MessengerPanelToggleButton;
