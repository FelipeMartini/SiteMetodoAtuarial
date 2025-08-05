import { NavLink } from 'react-router';
import { CSSProperties, ReactNode } from 'react';

export type NavLinkAdapterPropsType = {
	activeClassName?: string;
	activeStyle?: CSSProperties;
	children?: ReactNode;
	to?: string;
	href?: string;
	className?: string;
	style?: CSSProperties;
	role?: string;
	exact?: boolean;
	ref?: React.RefObject<HTMLAnchorElement>;
};

/**
 * The NavLinkAdapter component is a wrapper around the Next.js Link component.
 * It adds the ability to navigate programmatically using the useRouter hook.
 * The component is memoized to prevent unnecessary re-renders.
 */
function NavLinkAdapter(props: NavLinkAdapterPropsType) {
	const { children, activeClassName = 'active', activeStyle, role = 'button', to, href, ref, ..._props } = props;

	const targetUrl = to || href;

	return (
		<NavLink
			role={role}
			to={targetUrl}
			className={({ isActive }) =>
				[_props.className, isActive ? activeClassName : null].filter(Boolean).join(' ')
			}
			style={({ isActive }) => ({
				..._props.style,
				...(isActive ? activeStyle : null)
			})}
			ref={ref}
			{..._props}
		>
			{children}
		</NavLink>
	);
}

export default NavLinkAdapter;
