import { memo } from 'react';
import ThemePreview, { FuseThemeOption } from '@fuse/core/FuseThemeSelector/ThemePreview';

type FuseThemeSchemesProps = {
	onSelect?: (t: FuseThemeOption) => void;
	options: FuseThemeOption[];
};

/**
 * The FuseThemeSchemes component is responsible for rendering a list of theme schemes with preview images.
 * It uses the SchemePreview component to render each scheme preview.
 * The component is memoized to prevent unnecessary re-renders.
 */
function FuseThemeSelector(props: FuseThemeSchemesProps) {
	const { onSelect, options } = props;

	return (
		<div>
			<div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
				{options.map((item) => (
					<ThemePreview
						key={item.id}
						className=""
						theme={item}
						onSelect={onSelect}
					/>
				))}
			</div>
		</div>
	);
}

export default memo(FuseThemeSelector);
