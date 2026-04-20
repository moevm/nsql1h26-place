import { runApi } from './hooks';
import type { SearchCategory, SearchResult } from '../models/SearchResult';

type SearchPayload = {
    query: string;
    categories?: SearchCategory[];
};

export const searchEntities = ({ query, categories }: SearchPayload) => {
    const params = new URLSearchParams({ query });

    if (categories?.length) {
        params.set('categories', categories.join(','));
    }

    return runApi<SearchResult[]>('GET', `/search?${params.toString()}`);
};
