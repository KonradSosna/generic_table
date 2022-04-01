import React, { DependencyList } from 'react';

export const useDebouncedEffect = (
	effect: (...args: any[]) => any,
	delay: number,
	deps: DependencyList
) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const callback = React.useCallback(effect, deps);

	React.useEffect(() => {
		const handler = setTimeout(() => {
			callback();
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [callback, delay]);
};
