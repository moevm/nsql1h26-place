import { ApiPropertyOptional } from '@nestjs/swagger';
import { WaypointDto } from './create-route.dto';

export class UpdateRouteDto {
  @ApiPropertyOptional({ description: 'Map ID the route belongs to', example: '1' })
  map_id?: string;

  @ApiPropertyOptional({ description: 'Route name', example: 'Маршрут с подосиновиками' })
  name?: string;

  @ApiPropertyOptional({ description: 'Route description', example: 'Тут прямо очень много подосиновиков' })
  description?: string;

  @ApiPropertyOptional({ description: 'Route tag IDs', example: ['2'] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Route creation datetime (ISO)', example: '2026-03-10T10:00:00.389Z' })
  created_at?: string;

  @ApiPropertyOptional({ description: 'Route update datetime (ISO)', example: '2026-03-15T13:10:00.389Z' })
  updated_at?: string;

  @ApiPropertyOptional({ description: 'Route waypoints', type: [WaypointDto] })
  waypoints?: WaypointDto[];

  @ApiPropertyOptional({ description: 'Route image file name', example: 'route_icon.png' })
  image_path?: string;
}
