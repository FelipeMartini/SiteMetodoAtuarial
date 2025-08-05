// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleCollapseComponent from '../../../ui/material-ui-components/transitions/SimpleCollapse';
import SimpleCollapseRaw from '../../../ui/material-ui-components/transitions/SimpleCollapse.tsx?raw';
import SimpleFadeComponent from '../../../ui/material-ui-components/transitions/SimpleFade';
import SimpleFadeRaw from '../../../ui/material-ui-components/transitions/SimpleFade.tsx?raw';
import SimpleGrowComponent from '../../../ui/material-ui-components/transitions/SimpleGrow';
import SimpleGrowRaw from '../../../ui/material-ui-components/transitions/SimpleGrow.tsx?raw';
import SimpleSlideComponent from '../../../ui/material-ui-components/transitions/SimpleSlide';
import SimpleSlideRaw from '../../../ui/material-ui-components/transitions/SimpleSlide.tsx?raw';
import SlideFromContainerComponent from '../../../ui/material-ui-components/transitions/SlideFromContainer';
import SlideFromContainerRaw from '../../../ui/material-ui-components/transitions/SlideFromContainer.tsx?raw';
import SimpleZoomComponent from '../../../ui/material-ui-components/transitions/SimpleZoom';
import SimpleZoomRaw from '../../../ui/material-ui-components/transitions/SimpleZoom.tsx?raw';
import TransitionGroupExampleComponent from '../../../ui/material-ui-components/transitions/TransitionGroupExample';
import TransitionGroupExampleRaw from '../../../ui/material-ui-components/transitions/TransitionGroupExample.tsx?raw';

function TransitionsDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/transitions"
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
				Transitions
			</Typography>
			<Typography className="description">Transitions help to make a UI expressive and easy to use.</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Material UI provides transitions that can be used to introduce some basic{' '}
				<a href="https://m2.material.io/design/motion/">motion</a> to your applications.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Collapse
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Expand from the start edge of the child element. Use the <code>orientation</code> prop if you need a
				horizontal collapse. The <code>collapsedSize</code> prop can be used to set the minimum width/height
				when not expanded.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleCollapse.js"
					className="my-4"
					iframe={false}
					component={SimpleCollapseComponent}
					raw={SimpleCollapseRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fade
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Fade in from transparent to opaque.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleFade.js"
					className="my-4"
					iframe={false}
					component={SimpleFadeComponent}
					raw={SimpleFadeRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Grow
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Expands outwards from the center of the child element, while also fading in from transparent to opaque.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The second example demonstrates how to change the <code>transform-origin</code>, and conditionally
				applies the <code>timeout</code> prop to change the entry speed.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleGrow.js"
					className="my-4"
					iframe={false}
					component={SimpleGrowComponent}
					raw={SimpleGrowRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Slide
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Slide in from the edge of the screen. The <code>direction</code> prop controls which edge of the screen
				the transition starts from.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Transition component&#39;s <code>mountOnEnter</code> prop prevents the child component from being
				mounted until <code>in</code> is <code>true</code>. This prevents the relatively positioned component
				from scrolling into view from its off-screen position. Similarly, the <code>unmountOnExit</code> prop
				removes the component from the DOM after it has been transition off-screen.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleSlide.js"
					className="my-4"
					iframe={false}
					component={SimpleSlideComponent}
					raw={SimpleSlideRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Slide relative to a container
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Slide component also accepts <code>container</code> prop, which is a reference to a DOM node. If
				this prop is set, the Slide component will slide from the edge of that DOM node.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SlideFromContainer.js"
					className="my-4"
					iframe={false}
					component={SlideFromContainerComponent}
					raw={SlideFromContainerRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Zoom
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Expand outwards from the center of the child element.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This example also demonstrates how to delay the enter transition.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleZoom.js"
					className="my-4"
					iframe={false}
					component={SimpleZoomComponent}
					raw={SimpleZoomRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Child requirement
			</Typography>
			<ul className="space-y-4">
				<li>
					<strong>Forward the style</strong>: To better support server rendering, Material UI provides a{' '}
					<code>style</code> prop to the children of some transition components (Fade, Grow, Zoom, Slide). The{' '}
					<code>style</code> prop must be applied to the DOM for the animation to work as expected.
				</li>
				<li>
					<strong>Forward the ref</strong>: The transition components require the first child element to
					forward its ref to the DOM node. For more details about ref, check out{' '}
					<a href="/material-ui/guides/composition/#caveat-with-refs">Caveat with refs</a>
				</li>
				<li>
					<strong>Single element</strong>: The transition components require only one child element (
					<code>React.Fragment</code> is not allowed).
				</li>
			</ul>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
// The \`props\` object contains a \`style\` prop.
// You need to provide it to the \`div\` element as shown here.
const MyComponent = React.forwardRef(function (props, ref) {
  return (
    <div ref={ref} {...props}>
      Fade
    </div>
  );
});

export default function Main() {
  return (
    <Fade>
      {/* MyComponent must be the only child */}
      <MyComponent />
    </Fade>
  );
}
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				TransitionGroup
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To animate a component when it is mounted or unmounted, you can use the{' '}
				<a href="https://reactcommunity.org/react-transition-group/transition-group/">
					<code>TransitionGroup</code>
				</a>{' '}
				component from <em>react-transition-group</em>. As components are added or removed, the <code>in</code>{' '}
				prop is toggled automatically by <code>TransitionGroup</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TransitionGroupExample.js"
					className="my-4"
					iframe={false}
					component={TransitionGroupExampleComponent}
					raw={TransitionGroupExampleRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				TransitionComponent prop
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Some Material UI components use these transitions internally. These accept a{' '}
				<code>TransitionComponent</code> prop to customize the default transition. You can use any of the above
				components or your own. It should respect the following conditions:
			</Typography>
			<ul className="space-y-4">
				<li>
					Accepts an <code>in</code> prop. This corresponds to the open/close state.
				</li>
				<li>
					Call the <code>onEnter</code> callback prop when the enter transition starts.
				</li>
				<li>
					Call the <code>onExited</code> callback prop when the exit transition is completed. These two
					callbacks allow to unmount the children when in a closed state and fully transitioned.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For more information on creating a custom transition, visit the <em>react-transition-group</em>{' '}
				<a href="https://reactcommunity.org/react-transition-group/transition/">
					<code>Transition</code> documentation
				</a>
				. You can also visit the dedicated sections of some of the components:
			</Typography>
			<ul className="space-y-4">
				<li>
					<a href="/material-ui/react-modal/#transitions">Modal</a>
				</li>
				<li>
					<a href="/material-ui/react-dialog/#transitions">Dialog</a>
				</li>
				<li>
					<a href="/material-ui/react-popper/#transitions">Popper</a>
				</li>
				<li>
					<a href="/material-ui/react-snackbar/#transitions">Snackbar</a>
				</li>
				<li>
					<a href="/material-ui/react-tooltip/#transitions">Tooltip</a>
				</li>
			</ul>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Performance &amp; SEO
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The content of transition component is mounted by default even if <code>{`in={false}`}</code>. This
				default behavior has server-side rendering and SEO in mind. If you render expensive component trees
				inside your transition it might be a good idea to change this default behavior by enabling the
				<code>unmountOnExit</code> prop:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Fade in={false} unmountOnExit />
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				As with any performance optimization this is not a silver bullet. Be sure to identify bottlenecks first
				and then try out these optimization strategies.
			</Typography>
		</>
	);
}

export default TransitionsDoc;
