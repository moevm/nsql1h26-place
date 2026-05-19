import { runApi } from './hooks';
import type { StatisticsFilters, StatisticsSummaryItem } from '../models/Statistics';

export const buildStatisticsSummaryPath = (filters: StatisticsFilters): string => {
    const params = new URLSearchParams();

    params.set('dataType', filters.dataType);
    params.set('visibility', filters.visibility);
    params.set('period', filters.period);

    if (filters.categories.length) {
        params.set('categories', filters.categories.join(','));
    }

    if (filters.tags.length) {
        params.set('tags', filters.tags.join(','));
    }

    const query = params.toString();
    return query ? `/statistics/summary?${query}` : '/statistics/summary';
};

export const fetchStatisticsSummary = (filters: StatisticsFilters) =>
    runApi<StatisticsSummaryItem[]>('GET', buildStatisticsSummaryPath(filters));
