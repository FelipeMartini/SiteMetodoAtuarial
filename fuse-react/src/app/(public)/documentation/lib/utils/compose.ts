type Func<A, B> = (arg: A) => B;

export default function compose<A, B, C>(f: Func<B, C>, g: Func<A, B>): Func<A, C> {
	return function (x: A): C {
		return f(g(x));
	};
}
