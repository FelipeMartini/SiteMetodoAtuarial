import { MenuItem, Select } from '@mui/material';
import { useGetProjects } from '../../api/hooks/projects/useGetProjects';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

function ProjectSelector() {
	const { data: projects } = useGetProjects();

	const [selectedProject, setSelectedProject] = useState<{ id: number; menuEl: HTMLElement | null }>({
		id: 1,
		menuEl: null
	});

	function handleChangeProject(event: SelectChangeEvent<number>) {
		setSelectedProject({
			id: event.target.value,
			menuEl: null
		});
	}

	return (
		<div className="flex items-center">
			{projects && projects.length > 0 && (
				<Select
					value={selectedProject?.id}
					onChange={handleChangeProject}
					className="flex items-center"
					sx={(theme) => ({
						backgroundColor: `${theme.vars.palette.background.default}!important`,
						borderColor: theme.vars.palette.divider
					})}
				>
					{projects?.map((project) => (
						<MenuItem
							key={project.id}
							value={project.id}
						>
							{project.name}
						</MenuItem>
					))}
				</Select>
			)}
		</div>
	);
}

export default ProjectSelector;
