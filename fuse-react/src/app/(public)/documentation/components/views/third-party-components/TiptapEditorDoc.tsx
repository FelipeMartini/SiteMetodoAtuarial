'use client';

import FuseExample from '@fuse/core/FuseExample';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TiptapEditorExampleRaw from '../../ui/third-party-components/tiptap-editor-examples/TiptapEditorExample.tsx?raw';
import TiptapEditorExample from '../../ui/third-party-components/tiptap-editor-examples/TiptapEditorExample';
import Link from '@fuse/core/Link';

/**
 * Tiptap Editor Doc
 * This document provides information on how to use Tiptap Editor.
 */
function TiptapEditorDoc() {
	return (
		<>
			<div className="mb-6 flex w-full items-center justify-between">
				<Typography variant="h4">Tiptap Editor</Typography>

				<Button
					variant="contained"
					color="secondary"
					component="a"
					href="https://tiptap.dev/introduction"
					target="_blank"
					role="button"
					startIcon={<FuseSvgIcon>lucide:external-link</FuseSvgIcon>}
					className="not-prose"
				>
					Reference
				</Button>
			</div>
			<Typography
				className="mb-4"
				component="p"
			>
				Tiptap is a headless editor for React. It is a powerful and flexible text editor that can be used to
				create rich text editors with ease.
			</Typography>

			<hr className="not-prose" />

			<Typography
				className="mt-8 mb-2 text-5xl"
				component="h2"
			>
				Example Usages
			</Typography>

			<FuseExample
				className="mb-4"
				component={TiptapEditorExample}
				raw={TiptapEditorExampleRaw}
			/>

			<Typography
				className="mt-8 mb-2 text-5xl"
				component="h2"
			>
				Examples
			</Typography>

			<ul>
				<li className="mb-2">
					<Link to="/apps/mailbox/sidebar/MailCompose">
						@/app/(control-panel)/apps/mailbox/sidebar/MailCompose.tsx
					</Link>
				</li>
			</ul>
		</>
	);
}

export default TiptapEditorDoc;
