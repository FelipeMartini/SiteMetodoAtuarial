import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { Product } from '../../../../../api/types';

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	'& .productImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	'& .productImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover .productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

/**
 * The product images tab.
 */
function ProductImagesTab() {
	const methods = useFormContext();
	const { control, watch } = methods;

	const images = watch('images') as Product['images'];

	return (
		<Root>
			<div className="-mx-3 flex flex-wrap sm:justify-center sm:justify-start">
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Box
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.2)
								})
							})}
							component="label"
							htmlFor="button-file"
							className="productImageUpload relative mx-3 mb-6 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-sm hover:shadow-lg"
						>
							<input
								accept="image/*"
								className="hidden"
								id="button-file"
								type="file"
								onChange={async (e) => {
									function readFileAsync() {
										return new Promise((resolve, reject) => {
											const file = e?.target?.files?.[0];

											if (!file) {
												return;
											}

											const reader = new FileReader();
											reader.onload = () => {
												resolve({
													id: FuseUtils.generateGUID(),
													url: `data:${file.type};base64,${btoa(reader.result as string)}`,
													type: 'image'
												});
											};
											reader.onerror = reject;
											reader.readAsBinaryString(file);
										});
									}

									const newImage = await readFileAsync();
									onChange([newImage, ...(value as Product['images'])]);
								}}
							/>
							<FuseSvgIcon
								size={32}
								color="action"
							>
								lucide:square-arrow-up
							</FuseSvgIcon>
						</Box>
					)}
				/>
				<Controller
					name="featuredImageId"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => {
						return (
							<>
								{images?.map((media) => (
									<Box
										sx={(theme) => ({
											backgroundColor: lighten(theme.palette.background.default, 0.02),
											...theme.applyStyles('light', {
												backgroundColor: lighten(theme.palette.background.default, 0.2)
											})
										})}
										onClick={() => onChange(media.id)}
										onKeyDown={() => onChange(media.id)}
										role="button"
										tabIndex={0}
										className={clsx(
											'productImageItem relative mx-3 mb-6 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-sm outline-hidden hover:shadow-lg',
											media.id === value && 'featured'
										)}
										key={media.id}
									>
										<FuseSvgIcon className="productImageFeaturedStar">lucide:star</FuseSvgIcon>
										<img
											className="h-full w-auto max-w-none"
											src={media.url}
											alt="product"
										/>
									</Box>
								))}
							</>
						);
					}}
				/>
			</div>
		</Root>
	);
}

export default ProductImagesTab;
