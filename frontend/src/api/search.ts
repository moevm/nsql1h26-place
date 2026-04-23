import { runApi } from './hooks';
import type { SearchCategory, SearchResult } from '../models/SearchResult';

type SearchPayload = {
    query?: string;
    nameQuery?: string;
    descriptionQuery?: string;
    tagsQuery?: string;
    dateFromDay?: number;
    dateToDay?: number;
    categories?: SearchCategory[];
};

const appendTextParam = (params: URLSearchParams, key: string, value?: string) => {
    const normalizedValue = value?.trim();

    if (normalizedValue) {
        params.set(key, normalizedValue);
    }
};

export const searchEntities = ({
    query,
    nameQuery,
    descriptionQuery,
    tagsQuery,
    dateFromDay,
    dateToDay,
    categories,
}: SearchPayload) => {
    const params = new URLSearchParams();

    appendTextParam(params, 'query', query);
    appendTextParam(params, 'nameQuery', nameQuery);
    appendTextParam(params, 'descriptionQuery', descriptionQuery);
    appendTextParam(params, 'tagsQuery', tagsQuery);

    if (dateFromDay !== undefined && Number.isFinite(dateFromDay)) {
        params.set('dateFromDay', String(Math.floor(dateFromDay)));
    }

    if (dateToDay !== undefined && Number.isFinite(dateToDay)) {
        params.set('dateToDay', String(Math.floor(dateToDay)));
    }

    if (categories?.length) {
        params.set('categories', categories.join(','));
    }

    const queryString = params.toString();
    const path = queryString ? `/search?${queryString}` : '/search';

    return runApi<SearchResult[]>('GET', path);
};
