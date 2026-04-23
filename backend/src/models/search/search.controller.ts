import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchResultItem } from 'src/common/types/search.types';
import { SearchFilters, SearchService } from './search.service';

@ApiTags('Search')
@Controller('/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search maps and map objects with flexible filters' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Legacy query: searches in name, description and tags when specific filters are empty',
    example: 'подосин',
  })
  @ApiQuery({
    name: 'nameQuery',
    required: false,
    description: 'Case-insensitive substring to search in entity name',
    example: 'Лес',
  })
  @ApiQuery({
    name: 'descriptionQuery',
    required: false,
    description: 'Case-insensitive substring to search in entity description',
    example: 'берез',
  })
  @ApiQuery({
    name: 'tagsQuery',
    required: false,
    description: 'Case-insensitive substring to search in entity tags',
    example: 'осень',
  })
  @ApiQuery({
    name: 'dateFromDay',
    required: false,
    description: 'Inclusive day index from Unix epoch (UTC) for created_at lower bound',
    example: 19358,
  })
  @ApiQuery({
    name: 'dateToDay',
    required: false,
    description: 'Inclusive day index from Unix epoch (UTC) for created_at upper bound',
    example: 19723,
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    description: 'Comma-separated categories: maps, points, routes, areas',
    example: 'maps,points',
  })
  @ApiResponse({ status: 200, description: 'Search results list' })
  async search(
    @Query('query') query = '',
    @Query('nameQuery') nameQuery = '',
    @Query('descriptionQuery') descriptionQuery = '',
    @Query('tagsQuery') tagsQuery = '',
    @Query('dateFromDay') rawDateFromDay?: string | string[],
    @Query('dateToDay') rawDateToDay?: string | string[],
    @Query('categories') categories?: string | string[],
  ): Promise<SearchResultItem[]> {
    const filters: SearchFilters = {
      query,
      nameQuery,
      descriptionQuery,
      tagsQuery,
      dateFromDay: this.parseDay(rawDateFromDay),
      dateToDay: this.parseDay(rawDateToDay),
      categories,
    };

    return this.searchService.search(filters);
  }

  private parseDay(value?: string | string[]): number | undefined {
    const rawValue = Array.isArray(value) ? value[0] : value;
    if (!rawValue || rawValue.trim() === '') {
      return undefined;
    }

    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
      return undefined;
    }

    return Math.floor(numericValue);
  }
}
