import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchResultItem, SearchService } from './search.service';

@ApiTags('Search')
@Controller('/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search maps and map objects by substring (case-insensitive)' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Word or part of word to search in name and description',
    example: 'подосин',
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
    @Query('categories') categories?: string | string[],
  ): Promise<SearchResultItem[]> {
    return this.searchService.search(query, categories);
  }
}
