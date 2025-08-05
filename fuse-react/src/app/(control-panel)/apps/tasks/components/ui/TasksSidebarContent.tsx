type TasksSidebarContentProps = {
	children: React.ReactNode;
};

/**
 * The tasks sidebar content.
 */
function TasksSidebarContent(props: TasksSidebarContentProps) {
	const { children } = props;
	return <div className="flex flex-auto flex-col">{children}</div>;
}

export default TasksSidebarContent;
