export type StatisticsCategory = 'maps' | 'points' | 'routes' | 'areas';
export type StatisticsPeriod = 'day' | 'week' | 'month' | 'year';

export type StatisticsSummaryItem = {
    category: StatisticsCategory;
    count: number;
};

export type StatisticsFilters = {
    dataType: 'mine' | 'others';
    visibility: 'public' | 'private';
    period: StatisticsPeriod;
    categories: StatisticsCategory[];
    tags: string[];
};
