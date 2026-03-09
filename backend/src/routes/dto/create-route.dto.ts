import { ApiProperty } from '@nestjs/swagger';

export class WaypointDto {
  @ApiProperty({ description: 'Waypoint latitude', example: 59.787504 })
  x: number;

  @ApiProperty({ description: 'Waypoint longitude', example: 30.773917 })
  y: number;

  @ApiProperty({ description: 'Waypoint order in route', example: 1 })
  ordinal_number: number;
}

export class CreateRouteDto {
  @ApiProperty({ description: 'Map ID the route belongs to', example: '1' })
  map_id: string;

  @ApiProperty({ description: 'Route name', example: 'Маршрут с подосиновиками' })
  name: string;

  @ApiProperty({ description: 'Route description', example: 'Тут прямо очень много подосиновиков' })
  description: string;

  @ApiProperty({ description: 'Route tag IDs', example: ['2'] })
  tags: string[];

  @ApiProperty({ description: 'Route creation datetime (ISO)', example: '2026-03-10T10:00:00.389Z' })
  created_at: string;

  @ApiProperty({ description: 'Route update datetime (ISO)', example: '2026-03-15T13:10:00.389Z' })
  updated_at: string;

  @ApiProperty({ description: 'Route waypoints', type: [WaypointDto] })
  waypoints: WaypointDto[];

  @ApiProperty({ description: 'Route image file name', example: 'route_icon.png' })
  image_path: string;
}
