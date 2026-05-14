import { runApi } from './hooks';
import type { Tag } from '../models/Tag';

export const fetchTags = (search?: string): Promise<Tag[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return runApi<Tag[]>('GET', `/tags${query}`);
};
