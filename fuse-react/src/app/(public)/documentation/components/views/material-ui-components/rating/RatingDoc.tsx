// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicRatingComponent from '../../../ui/material-ui-components/rating/BasicRating';
import BasicRatingRaw from '../../../ui/material-ui-components/rating/BasicRating.tsx?raw';
import HalfRatingComponent from '../../../ui/material-ui-components/rating/HalfRating';
import HalfRatingRaw from '../../../ui/material-ui-components/rating/HalfRating.tsx?raw';
import HoverRatingComponent from '../../../ui/material-ui-components/rating/HoverRating';
import HoverRatingRaw from '../../../ui/material-ui-components/rating/HoverRating.tsx?raw';
import RatingSizeComponent from '../../../ui/material-ui-components/rating/RatingSize';
import RatingSizeRaw from '../../../ui/material-ui-components/rating/RatingSize.tsx?raw';
import CustomizedRatingComponent from '../../../ui/material-ui-components/rating/CustomizedRating';
import CustomizedRatingRaw from '../../../ui/material-ui-components/rating/CustomizedRating.tsx?raw';
import RadioGroupRatingComponent from '../../../ui/material-ui-components/rating/RadioGroupRating';
import RadioGroupRatingRaw from '../../../ui/material-ui-components/rating/RadioGroupRating.tsx?raw';
import TextRatingComponent from '../../../ui/material-ui-components/rating/TextRating';
import TextRatingRaw from '../../../ui/material-ui-components/rating/TextRating.tsx?raw';

function RatingDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/rating"
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
				Rating
			</Typography>
			<Typography className="description">
				Ratings provide insight regarding others' opinions and experiences, and can allow the user to submit a
				rating of their own.
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic rating
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicRating.js"
					className="my-4"
					iframe={false}
					component={BasicRatingComponent}
					raw={BasicRatingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Rating precision
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The rating can display any float number with the <code>value</code> prop. Use the <code>precision</code>{' '}
				prop to define the minimum increment value change allowed.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="HalfRating.js"
					className="my-4"
					iframe={false}
					component={HalfRatingComponent}
					raw={HalfRatingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Hover feedback
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can display a label on hover to help the user pick the correct rating value. The demo uses the{' '}
				<code>onChangeActive</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="HoverRating.js"
					className="my-4"
					iframe={false}
					component={HoverRatingComponent}
					raw={HoverRatingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Sizes
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For larger or smaller ratings use the <code>size</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="RatingSize.js"
					className="my-4"
					iframe={false}
					component={RatingSizeComponent}
					raw={RatingSizeRaw}
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
				Here are some examples of customizing the component. You can learn more about this in the{' '}
				<a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedRating.js"
					className="my-4"
					iframe={false}
					component={CustomizedRatingComponent}
					raw={CustomizedRatingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Radio group
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The rating is implemented with a radio group, set <code>highlightSelectedOnly</code> to restore the
				natural behavior.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="RadioGroupRating.js"
					className="my-4"
					iframe={false}
					component={RadioGroupRatingComponent}
					raw={RadioGroupRatingRaw}
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
				(<a href="https://www.w3.org/WAI/tutorials/forms/custom-controls/#a-star-rating">WAI tutorial</a>)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The accessibility of this component relies on:
			</Typography>
			<ul className="space-y-4">
				<li>
					A radio group with its fields visually hidden. It contains six radio buttons, one for each star, and
					another for 0 stars that is checked by default. Be sure to provide a value for the <code>name</code>{' '}
					prop that is unique to the parent form.
				</li>
				<li>
					Labels for the radio buttons containing actual text (&quot;1 Star&quot;, &quot;2 Stars&quot;, …). Be
					sure to provide a suitable function to the <code>getLabelText</code> prop when the page is in a
					language other than English. You can use the{' '}
					<a href="/material-ui/guides/localization/">included locales</a>, or provide your own.
				</li>
				<li>
					A visually distinct appearance for the rating icons. By default, the rating component uses both a
					difference of color and shape (filled and empty icons) to indicate the value. In the event that you
					are using color as the only means to indicate the value, the information should also be also
					displayed as text, as in this demo. This is important to match{' '}
					<a href="https://www.w3.org/TR/WCAG21/#use-of-color">success Criterion 1.4.1</a> of WCAG2.1.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TextRating.js"
					className="my-4"
					iframe={false}
					component={TextRatingComponent}
					raw={TextRatingRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				ARIA
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The read only rating has a role of &quot;img&quot;, and an aria-label that describes the displayed
				rating.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Keyboard
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Because the rating component uses radio buttons, keyboard interaction follows the native browser
				behavior. Tab will focus the current rating, and cursor keys control the selected rating.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The read only rating is not focusable.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Testing
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When testing the Rating component in environments such as Jest with jsdom, certain user
				interactions—especially hover-based interactions—may not behave as expected. This is because the
				component relies on <code>getBoundingClientRect()</code> to calculate the position of each icon and
				determine which icon is currently being hovered. In jsdom, <code>getBoundingClientRect()</code> returns{' '}
				<code>0</code> values by default, which can lead to incorrect behavior such as <code>NaN</code> being
				passed to the <code>onChange</code> handler.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To avoid this issue in your test suite:
			</Typography>
			<ul className="space-y-4">
				<li>
					Prefer <code>fireEvent</code> over <code>userEvent</code> when simulating click events.
				</li>
				<li>Avoid relying on hover behavior to trigger changes.</li>
				<li>
					If needed, mock <code>getBoundingClientRect()</code> manually for more advanced interactions.
				</li>
			</ul>

			<FuseHighlight
				component="pre"
				className="language-tsx"
			>
				{` 
// @vitest-environment jsdom

import { Rating } from '@mui/material';
import { render, fireEvent, screen } from '@testing-library/react';

import { describe, test, vi } from 'vitest';

describe('Rating', () => {
  test('should update rating on click', () => {
    const handleChange = vi.fn();
    render(<Rating onChange={(_, newValue) => handleChange(newValue)} />);

    fireEvent.click(screen.getByLabelText('2 Stars'));

    expect(handleChange).toHaveBeenCalledWith(2);
  });
});
`}
			</FuseHighlight>
		</>
	);
}

export default RatingDoc;
