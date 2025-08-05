import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useQuickPanelContext } from './contexts/QuickPanelContext/useQuickPanelContext';

type QuickPanelToggleButtonProps = {
	className?: string;
	children?: React.ReactNode;
};

/**
 * The quick panel toggle button.
 */
function QuickPanelToggleButton(props: QuickPanelToggleButtonProps) {
	const { className = '', children = <FuseSvgIcon>lucide:bookmark</FuseSvgIcon> } = props;
	const { toggleQuickPanel } = useQuickPanelContext();

	return (
		<IconButton
			onClick={() => toggleQuickPanel()}
			className={className}
		>
			{children}
		</IconButton>
	);
}

export default QuickPanelToggleButton;
