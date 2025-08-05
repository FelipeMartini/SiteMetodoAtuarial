import useUser from './useUser';

function withUser(Component) {
	return function WrappedComponent(props) {
		const userProps = useUser();
		return (
			<Component
				{...props}
				{...userProps}
			/>
		);
	};
}

export default withUser;
