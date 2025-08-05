const fuseNavigationShowcase = [
	{
		id: 'navigation-features',
		title: 'Navigation features',
		subtitle: 'Collapsable levels & badge styles',
		type: 'group',
		icon: 'lucide:columns-3',
		children: [
			{
				id: 'navigation-features.level.0',
				title: 'Level 0',
				icon: 'lucide:circle-check',
				type: 'collapse',
				children: [
					{
						id: 'navigation-features.level.0.1',
						title: 'Level 1',
						type: 'collapse',
						children: [
							{
								id: 'navigation-features.level.0.1.2',
								title: 'Level 2',
								type: 'collapse',
								children: [
									{
										id: 'navigation-features.level.0.1.2.3',
										title: 'Level 3',
										type: 'collapse',
										children: [
											{
												id: 'navigation-features.level.0.1.2.3.4',
												title: 'Level 4',
												type: 'collapse',
												children: [
													{
														id: 'navigation-features.level.0.1.2.3.4.5',
														title: 'Level 5',
														type: 'collapse',
														children: [
															{
																id: 'navigation-features.level.0.1.2.3.4.5.6',
																title: 'Level 6',
																type: 'item'
															}
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				id: 'navigation-features2.level.0',
				title: 'Level 0',
				subtitle: 'With subtitle',
				icon: 'lucide:circle-check',
				type: 'collapse',
				children: [
					{
						id: 'navigation-features2.level.0.1-1',
						title: 'Level 1.1',
						type: 'item'
					},
					{
						id: 'navigation-features2.level.0.1-2',
						title: 'Level 1.2',
						type: 'item'
					}
				]
			},
			{
				id: 'navigation-features.active',
				title: 'Active item',
				subtitle: 'Manually marked as active',
				icon: 'lucide:circle-check',
				type: 'item',
				active: true
			},
			{
				id: 'navigation-features.disabled-collapse',
				title: 'Disabled collapse',
				subtitle: 'Some subtitle',
				icon: 'lucide:circle-check',
				type: 'collapse',
				disabled: true,
				children: [
					{
						id: 'navigation-features.disabled-collapse.child',
						title: "You shouldn't be able to see this child",
						type: 'item'
					}
				]
			},
			{
				id: 'navigation-features.disabled-item',
				title: 'Disabled item',
				subtitle: 'Some subtitle',
				icon: 'lucide:circle-check',
				type: 'item',
				disabled: true
			},
			{
				id: 'navigation-features.badge-style-oval',
				title: 'Oval badge',
				icon: 'lucide:tag',
				type: 'item',
				badge: {
					title: '8',
					classes: 'w-20 h-20 bg-teal-400 text-black rounded-full'
				}
			},
			{
				id: 'navigation-features.badge-style-rectangle',
				title: 'Rectangle badge',
				icon: 'lucide:tag',
				type: 'item',
				badge: {
					title: 'Updated!',
					classes: 'px-8 bg-teal-400 text-black rounded'
				}
			},
			{
				id: 'navigation-features.badge-style-rounded',
				title: 'Rounded badge',
				icon: 'lucide:tag',
				type: 'item',
				badge: {
					title: 'NEW',
					classes: 'px-10 bg-teal-400 text-black rounded-full'
				}
			},
			{
				id: 'navigation-features.badge-style-simple',
				title: 'Simple badge',
				icon: 'lucide:tag',
				type: 'item',
				badge: {
					title: '87 Unread',
					classes: 'bg-transparent text-teal-500'
				}
			}
		]
	}
];

export default fuseNavigationShowcase;
