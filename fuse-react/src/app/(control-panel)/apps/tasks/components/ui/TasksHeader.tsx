import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from 'lodash';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useGetTasks } from '../../api/hooks/tasks/useGetTasks';
import { useTasksAppContext } from '../../contexts/TasksAppContext/useTasksAppContext';
import { OutlinedInput } from '@mui/material';

/**
 * The tasks header.
 */
function TasksHeader() {
	const { data: tasks } = useGetTasks();
	const { searchText, setSearchText } = useTasksAppContext();

	const remainingTasks = _.filter(tasks, (item) => item.type === 'task' && !item.completed).length;

	return (
		<div className="container flex w-full border-b">
			<div className="flex flex-auto flex-col p-4 md:px-8">
				<PageBreadcrumb className="mb-2" />
				<div className="flex min-w-0 flex-auto flex-col gap-2 md:flex-row">
					<div className="flex flex-auto flex-col">
						<motion.span
							initial={{ x: -20 }}
							animate={{
								x: 0,
								transition: { delay: 0.2 }
							}}
						>
							<Typography className="mb-1 text-3xl leading-none font-bold tracking-tight">
								Tasks
							</Typography>
						</motion.span>

						<motion.span
							initial={{
								y: -20,
								opacity: 0
							}}
							animate={{
								y: 0,
								opacity: 1,
								transition: { delay: 0.2 }
							}}
						>
							<Typography
								className="ml-0.5 text-base font-medium"
								color="text.secondary"
							>
								{`${remainingTasks} remaining tasks`}
							</Typography>
						</motion.span>
					</div>

					<div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
						<OutlinedInput
							placeholder="Search"
							value={searchText}
							slotProps={{
								input: {
									'aria-label': 'Search'
								}
							}}
							onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSearchText(ev.target.value)}
						/>
						<div className="flex items-center gap-2">
							<Button
								className="whitespace-nowrap"
								component={NavLinkAdapter}
								to="/apps/tasks/new/section"
								color="primary"
								variant="contained"
								startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
							>
								Add Section
							</Button>
							<Button
								className="whitespace-nowrap"
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="/apps/tasks/new/task"
								startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
							>
								Add Task
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TasksHeader;
