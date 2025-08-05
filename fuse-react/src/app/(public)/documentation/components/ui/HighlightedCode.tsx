import FuseHighlight from '@fuse/core/FuseHighlight';

type HighlightedCodeProps = {
	code: string;
	language: string;
	ref?: React.RefObject<HTMLDivElement>;
};

export function HighlightedCode(props: HighlightedCodeProps) {
	const { code, ref, language, ...other } = props;

	return (
		<FuseHighlight
			component="pre"
			className={`language-${language || 'jsx'}`}
			ref={ref}
			{...other}
		>
			{code}
		</FuseHighlight>
	);
}

export default HighlightedCode;
