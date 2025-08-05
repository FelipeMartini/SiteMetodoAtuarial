import _ from 'lodash';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { Draggable } from '@hello-pangea/dnd';
import { AvatarGroup } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MouseEvent } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import BoardCardLabel from './BoardCardLabel';
import BoardCardDueDate from './BoardCardDueDate';
import BoardCardCheckItems from './BoardCardCheckItems';
import { ScrumboardCard } from '../../../../api/types';
import { useScrumboardAppContext } from '../../../../contexts/ScrumboardAppContext/useScrumboardAppContext';
import { useGetScrumboardBoard } from '../../../../api/hooks/boards/useGetScrumboardBoard';
import { useGetScrumboardBoardCards } from '../../../../api/hooks/cards/useGetScrumboardBoardCards';
import { useGetScrumboardMembers } from '../../../../api/hooks/members/useGetScrumboardMembers';

const StyledCard = styled(Card)(({ theme }) => ({
	'& ': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	}
}));

type BoardCardProps = {
	cardId: string;
	index: number;
	boardId: string;
};

/**
 * The board card component.
 */
function BoardCard(props: BoardCardProps) {
	const { cardId, index, boardId } = props;
	const { openCardDialog } = useScrumboardAppContext();

	const { data: board, isLoading: isBoardLoading } = useGetScrumboardBoard(boardId);
	const { data: cards, isLoading: isCardsLoading } = useGetScrumboardBoardCards(boardId);
	const { data: members, isLoading: isMembersLoading } = useGetScrumboardMembers();

	const card = _.find(cards, { id: cardId });

	function handleCardClick(ev: MouseEvent<HTMLDivElement>, _card: ScrumboardCard) {
		ev.preventDefault();

		openCardDialog(_card);
	}

	if (isBoardLoading || isCardsLoading || isMembersLoading) {
		return <FuseLoading />;
	}

	if (!card) {
		return null;
	}

	function getCommentsCount(_card: ScrumboardCard) {
		return _.sum(_card?.activities.map((x) => (x.type === 'comment' ? 1 : 0)));
	}

	const commentsCount = getCommentsCount(card);

	const cardCoverImage = _.find(card?.attachments, { id: card?.attachmentCoverId });

	return (
		<Draggable
			draggableId={cardId}
			index={index}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<StyledCard
						className={clsx(
							snapshot.isDragging ? 'shadow-lg' : 'shadow-sm',
							'w-full cursor-pointer rounded-lg border-1'
						)}
						onClick={(ev) => handleCardClick(ev, card)}
					>
						{board?.settings?.cardCoverImages && cardCoverImage && (
							<img
								className="block"
								src={cardCoverImage.src}
								alt="card cover"
							/>
						)}

						<div className="p-4 pb-0">
							{card.labels.length > 0 && (
								<div className="-mx-1 mb-2 flex flex-wrap">
									{card.labels.map((id) => (
										<BoardCardLabel
											id={id}
											key={id}
										/>
									))}
								</div>
							)}

							<Typography className="mb-3 font-medium">{card?.title}</Typography>

							{(card.dueDate || card.checklists.length > 0) && (
								<div className="-mx-1 mb-3 flex items-center">
									<BoardCardDueDate dueDate={card.dueDate} />

									<BoardCardCheckItems card={card} />
								</div>
							)}
						</div>

						<div className="flex h-12 justify-between px-4">
							<div className="flex items-center gap-1.5">
								{card?.subscribed && (
									<FuseSvgIcon
										size={16}
										color="action"
									>
										lucide:eye
									</FuseSvgIcon>
								)}

								{card.description !== '' && (
									<FuseSvgIcon
										size={16}
										color="action"
									>
										lucide:file-text
									</FuseSvgIcon>
								)}

								{card.attachments && (
									<span className="flex items-center gap-0.5">
										<FuseSvgIcon
											size={16}
											color="action"
										>
											lucide:paperclip
										</FuseSvgIcon>
										<Typography color="text.secondary">{card.attachments.length}</Typography>
									</span>
								)}
								{commentsCount > 0 && (
									<span className="flex items-center gap-0.5">
										<FuseSvgIcon
											size={16}
											color="action"
										>
											lucide:message-square-text
										</FuseSvgIcon>

										<Typography color="text.secondary">{commentsCount}</Typography>
									</span>
								)}
							</div>

							<div className="flex items-center justify-end gap-3">
								{card.memberIds.length > 0 && (
									<div className="flex justify-start">
										<AvatarGroup
											max={3}
											classes={{ avatar: 'w-6 h-6 text-md' }}
										>
											{card.memberIds.map((id) => {
												const member = _.find(members, { id });
												return (
													<Tooltip
														title={member?.name}
														key={id}
													>
														<Avatar
															key={index}
															alt="member"
															src={member?.avatar}
														/>
													</Tooltip>
												);
											})}
										</AvatarGroup>
									</div>
								)}
							</div>
						</div>
					</StyledCard>
				</div>
			)}
		</Draggable>
	);
}

export default BoardCard;
