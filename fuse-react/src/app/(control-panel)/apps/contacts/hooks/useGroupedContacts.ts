import { useMemo } from 'react';
import { GroupedContacts, AccumulatorType } from '../api/types';
import { useFilteredContacts } from './useFilteredContacts';

export function useGroupedContacts() {
	const { data: filteredContacts, isLoading } = useFilteredContacts();
	const groupedContacts = useMemo(() => {
		if (!filteredContacts || isLoading) {
			return [];
		}

		const sortedContacts = [...filteredContacts]?.sort((a, b) =>
			a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedContacts> = sortedContacts?.reduce<AccumulatorType>((r, e) => {
			const group = e.name[0];

			if (!r[group]) {
				r[group] = { group, children: [e] };
			} else {
				r[group]?.children?.push(e);
			}

			return r;
		}, {});

		return groupedObject;
	}, [filteredContacts, isLoading]);

	return { data: groupedContacts, isLoading };
}
