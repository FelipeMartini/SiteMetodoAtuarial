import { useQuery } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { Country } from '../../types';

export const countriesQueryKey = ['contacts', 'countries'];

export const useCountries = () => {
	return useQuery<Country[]>({
		queryFn: contactsApi.getCountries,
		queryKey: countriesQueryKey
	});
};
