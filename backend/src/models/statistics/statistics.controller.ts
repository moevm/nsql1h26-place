import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import type { AuthUser } from 'src/auth/current-user.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { StatisticsService, type StatisticsSummaryItem } from './statistics.service';

@ApiTags('Statistics')
@UseGuards(AuthGuard)
@Controller('/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get aggregated statistics by category' })
  @ApiQuery({
    name: 'dataType',
    required: false,
    description: 'Data ownership filter: mine or others',
    example: 'mine',
  })
  @ApiQuery({
    name: 'visibility',
    required: false,
    description: 'Visibility filter: public or private',
    example: 'public',
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    description: 'Comma-separated categories: maps, points, routes, areas',
    example: 'maps,points',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Time period: day, week, month, year',
    example: 'week',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    description: 'Comma-separated tag names to filter by',
    example: 'гриб,осень',
  })
  @ApiResponse({ status: 200, description: 'Statistics summary' })
  async getSummary(
    @CurrentUser() user: AuthUser,
    @Query('dataType') dataType?: string,
    @Query('visibility') visibility?: string,
    @Query('categories') categories?: string | string[],
    @Query('period') period?: string,
    @Query('tags') tags?: string | string[],
  ): Promise<StatisticsSummaryItem[]> {
    const filters = this.statisticsService.normalizeFilters({
      dataType,
      visibility,
      categories,
      period,
      tags,
    });
    return this.statisticsService.getSummary(filters, user._id);
  }
}
