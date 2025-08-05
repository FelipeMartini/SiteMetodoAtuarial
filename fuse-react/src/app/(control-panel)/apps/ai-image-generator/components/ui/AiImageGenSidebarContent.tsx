import AiImageGenHeader from './AiImageGenHeader';
import AiImageGenForm from '../forms/generator-form/AiImageGenForm';

function AiImageGenSidebarContent() {
	return (
		<div className="flex max-h-full min-h-0 w-full flex-col">
			<AiImageGenHeader className="flex-shrink-1 px-4 py-4 md:px-8" />
			<AiImageGenForm className="flex flex-auto flex-col" />
		</div>
	);
}

export default AiImageGenSidebarContent;
