import { Link as ILink, LinkProps as ILinkProps } from 'react-router';

import { ReactNode } from 'react';

type CustomLinkProps = Omit<ILinkProps, 'href'> & {
	to?: string;
	href?: string;
	children?: ReactNode;
	className?: string;
	role?: string;
	ref?: React.RefObject<HTMLAnchorElement>;
};

function Link(props: CustomLinkProps) {
	const { ref, to, href, children, className, role, ...rest } = props;

	return (
		<ILink
			className={className}
			to={to || href}
			role={role}
			ref={ref}
			{...rest}
		>
			{children}
		</ILink>
	);
}

export default Link;
