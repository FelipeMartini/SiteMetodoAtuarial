import Albums from './Albums';

/**
 * The photos videos tab.
 */
function PhotosVideosTab() {
	return (
		<div className="w-full md:flex">
			<div className="flex flex-1 flex-col md:ltr:pr-8 md:rtl:pl-8">
				<Albums />
			</div>
		</div>
	);
}

export default PhotosVideosTab;
