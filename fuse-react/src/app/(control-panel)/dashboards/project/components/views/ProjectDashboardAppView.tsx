'use client';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import * as React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { Tabs, Tab } from '@mui/material';
import ProjectDashboardAppHeader from '../ui/ProjectDashboardAppHeader';
import HomeTab from '../ui/tabs/home/HomeTab';
import TeamTab from '../ui/tabs/team/TeamTab';
import BudgetTab from '../ui/tabs/budget/BudgetTab';
import { useGetWidgets } from '../../api/hooks/widgets/useGetWidgets';
import ProjectSelector from '../ui/ProjectSelector';

/**
 * The ProjectDashboardApp page.
 */
function ProjectDashboardAppView() {
	const { isLoading } = useGetWidgets();

	const [tabValue, setTabValue] = useState('home');

	function handleTabChange(event: React.SyntheticEvent, value: string) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageSimple
			header={<ProjectDashboardAppHeader />}
			content={
				<div className="w-full pt-4 sm:pt-6">
					<div className="flex w-full flex-col justify-between gap-2 px-4 sm:flex-row sm:items-center md:px-8">
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							aria-label="New user tabs"
						>
							<Tab
								value="home"
								label="Home"
							/>
							<Tab
								value="budget"
								label="Budget"
							/>
							<Tab
								value="team"
								label="Team"
							/>
						</Tabs>

						<ProjectSelector />
					</div>
					{tabValue === 'home' && <HomeTab />}
					{tabValue === 'budget' && <BudgetTab />}
					{tabValue === 'team' && <TeamTab />}
				</div>
			}
		/>
	);
}

export default ProjectDashboardAppView;
