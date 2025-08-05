import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { lighten } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import Card from '@mui/material/Card';
import { ProfilePost } from '../../../../api/types';

type PostProps = {
	item: ProfilePost;
};

/**
 * The post item.
 */
function TimelinePostItem(props: PostProps) {
	const { item } = props;

	return (
		<Card className="mb-4 md:mb-8">
			<CardHeader
				className="px-8 pt-6"
				avatar={
					<Avatar
						aria-label="Recipe"
						src={item.user.avatar}
					/>
				}
				action={
					<IconButton
						aria-label="more"
						size="large"
					>
						<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
					</IconButton>
				}
				title={
					<span className="flex items-center gap-2">
						<Typography
							className="font-normal"
							color="secondary.main"
							component="span"
						>
							{item.user.name}
						</Typography>
						<span>
							{item.type === 'post' && 'posted on your timeline'}
							{item.type === 'something' && 'shared something with you'}
							{item.type === 'video' && 'shared a video with you'}
							{item.type === 'article' && 'shared an article with you'}
						</span>
					</span>
				}
				subheader={item.time}
			/>
			<CardContent className="px-8">
				{item.message && (
					<Typography
						component="p"
						className="mb-4"
					>
						{item.message}
					</Typography>
				)}

				{item.media && (
					<img
						src={item.media.preview}
						alt="post"
						className="rounded-lg"
					/>
				)}

				{item.article && (
					<div className="overflow-hidden rounded-lg border-1">
						<img
							className="w-full border-b-1"
							src={item.article.media.preview}
							alt="article"
						/>
						<div className="p-4">
							<Typography variant="subtitle1">{item.article.title}</Typography>
							<Typography variant="caption">{item.article.subtitle}</Typography>
							<Typography className="mt-4">{item.article.excerpt}</Typography>
						</div>
					</div>
				)}
			</CardContent>
			<CardActions
				disableSpacing
				className="px-8"
			>
				<Button
					size="small"
					aria-label="Add to favorites"
				>
					<FuseSvgIcon
						size={16}
						color="action"
					>
						lucide:heart
					</FuseSvgIcon>
					<Typography className="mx-1">Like</Typography>
					<Typography>({item.like})</Typography>
				</Button>
				<Button aria-label="Share">
					<FuseSvgIcon
						size={16}
						color="action"
					>
						lucide:share
					</FuseSvgIcon>
					<Typography className="mx-1">Share</Typography>
					<Typography>({item.share})</Typography>
				</Button>
			</CardActions>
			<Box
				className="card-footer flex flex-col border-t-1 px-8 py-6"
				sx={(theme) => ({
					backgroundColor: lighten(theme.palette.background.default, 0.02),
					...theme.applyStyles('light', {
						backgroundColor: lighten(theme.palette.background.default, 0.4)
					})
				})}
			>
				{item.comments && item.comments.length > 0 && (
					<div>
						<div className="flex items-center">
							<Typography>{item.comments.length} comments</Typography>
							<FuseSvgIcon
								size={16}
								className="mx-1"
								color="action"
							>
								lucide:chevron-down
							</FuseSvgIcon>
						</div>
						<List>
							{item.comments.map((comment) => (
								<div key={comment.id}>
									<ListItem className="-mx-2 px-0">
										<Avatar
											alt={comment.user.name}
											src={comment.user.avatar}
											className="mx-2"
										/>
										<ListItemText
											className="px-1"
											primary={
												<div className="flex items-center gap-2">
													<Typography
														className="font-normal"
														color="secondary"
														component="span"
													>
														{comment.user.name}
													</Typography>
													<Typography variant="caption">{comment.time}</Typography>
												</div>
											}
											secondary={comment.message}
										/>
									</ListItem>
									<div className="mx-13 mb-2 flex items-center">
										<Button endIcon={<FuseSvgIcon size={14}>lucide:undo-2</FuseSvgIcon>}>
											Reply
										</Button>
									</div>
								</div>
							))}
						</List>
					</div>
				)}

				<div className="-mx-1 flex flex-auto">
					<Avatar
						className="mx-1"
						src="/assets/images/avatars/profile.jpg"
					/>
					<div className="mx-1 flex flex-1 flex-col items-end">
						<Paper className="shadow-0 mb-4 w-full overflow-hidden border-1">
							<Input
								className="w-full p-3"
								classes={{ root: 'text-md' }}
								placeholder="Add a comment.."
								multiline
								rows="6"
								margin="none"
								disableUnderline
							/>
						</Paper>
						<div>
							<Button
								variant="contained"
								color="secondary"
								size="small"
							>
								Post comment
							</Button>
						</div>
					</div>
				</div>
			</Box>
		</Card>
	);
}

export default TimelinePostItem;
