// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicBreadcrumbsComponent from '../../../ui/material-ui-components/breadcrumbs/BasicBreadcrumbs';
import BasicBreadcrumbsRaw from '../../../ui/material-ui-components/breadcrumbs/BasicBreadcrumbs.tsx?raw';
import ActiveLastBreadcrumbComponent from '../../../ui/material-ui-components/breadcrumbs/ActiveLastBreadcrumb';
import ActiveLastBreadcrumbRaw from '../../../ui/material-ui-components/breadcrumbs/ActiveLastBreadcrumb.tsx?raw';
import CustomSeparatorComponent from '../../../ui/material-ui-components/breadcrumbs/CustomSeparator';
import CustomSeparatorRaw from '../../../ui/material-ui-components/breadcrumbs/CustomSeparator.tsx?raw';
import IconBreadcrumbsComponent from '../../../ui/material-ui-components/breadcrumbs/IconBreadcrumbs';
import IconBreadcrumbsRaw from '../../../ui/material-ui-components/breadcrumbs/IconBreadcrumbs.tsx?raw';
import CollapsedBreadcrumbsComponent from '../../../ui/material-ui-components/breadcrumbs/CollapsedBreadcrumbs';
import CollapsedBreadcrumbsRaw from '../../../ui/material-ui-components/breadcrumbs/CollapsedBreadcrumbs.tsx?raw';
import CondensedWithMenuComponent from '../../../ui/material-ui-components/breadcrumbs/CondensedWithMenu';
import CondensedWithMenuRaw from '../../../ui/material-ui-components/breadcrumbs/CondensedWithMenu.tsx?raw';
import CustomizedBreadcrumbsComponent from '../../../ui/material-ui-components/breadcrumbs/CustomizedBreadcrumbs';
import CustomizedBreadcrumbsRaw from '../../../ui/material-ui-components/breadcrumbs/CustomizedBreadcrumbs.tsx?raw';

function BreadcrumbsDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/breadcrumbs"
				target="_blank"
				role="button"
				size="small"
				startIcon={<FuseSvgIcon size={16}>lucide:square-arrow-out-up-right</FuseSvgIcon>}
			>
				Reference
			</Button>
			<Typography
				className="my-4 text-5xl font-bold"
				component="h1"
			>
				Breadcrumbs
			</Typography>
			<Typography className="description">
				A breadcrumbs is a list of links that help visualize a page's location within a site's hierarchical
				structure, it allows navigation up to any of the ancestors.
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic breadcrumbs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicBreadcrumbs.js"
					className="my-4"
					iframe={false}
					component={BasicBreadcrumbsComponent}
					raw={BasicBreadcrumbsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Active last breadcrumb
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Keep the last breadcrumb interactive.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ActiveLastBreadcrumb.js"
					className="my-4"
					iframe={false}
					component={ActiveLastBreadcrumbComponent}
					raw={ActiveLastBreadcrumbRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Custom separator
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In the following examples, we are using two string separators and an SVG icon.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomSeparator.js"
					className="my-4"
					iframe={false}
					component={CustomSeparatorComponent}
					raw={CustomSeparatorRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Breadcrumbs with icons
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IconBreadcrumbs.js"
					className="my-4"
					iframe={false}
					component={IconBreadcrumbsComponent}
					raw={IconBreadcrumbsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Collapsed breadcrumbs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CollapsedBreadcrumbs.js"
					className="my-4"
					iframe={false}
					component={CollapsedBreadcrumbsComponent}
					raw={CollapsedBreadcrumbsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Condensed with menu
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				As an alternative, consider adding a Menu component to display the condensed links in a dropdown list:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CondensedWithMenu.js"
					className="my-4"
					iframe={false}
					component={CondensedWithMenuComponent}
					raw={CondensedWithMenuRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Customization
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Here is an example of customizing the component. You can learn more about this in the{' '}
				<a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedBreadcrumbs.js"
					className="my-4"
					iframe={false}
					component={CustomizedBreadcrumbsComponent}
					raw={CustomizedBreadcrumbsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Accessibility
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				(WAI-ARIA:{' '}
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/">
					https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
				</a>
				)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Be sure to add a <code>aria-label</code> description on the <code>Breadcrumbs</code> component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The accessibility of this component relies on:
			</Typography>
			<ul className="space-y-4">
				<li>
					The set of links is structured using an ordered list (<code>{`<ol>`}</code> element).
				</li>
				<li>
					To prevent screen reader announcement of the visual separators between links, they are hidden with{' '}
					<code>aria-hidden</code>.
				</li>
				<li>
					A nav element labeled with <code>aria-label</code> identifies the structure as a breadcrumb trail
					and makes it a navigation landmark so that it is easy to locate.
				</li>
			</ul>
		</>
	);
}

export default BreadcrumbsDoc;
