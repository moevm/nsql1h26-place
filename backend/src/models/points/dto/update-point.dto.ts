import { ApiPropertyOptional } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiPropertyOptional({ description: 'Point X coordinate', example: 59.773007 })
  x?: number;

  @ApiPropertyOptional({ description: 'Point Y coordinate', example: 30.775178 })
  y?: number;
}

export class UpdatePointDto {
  @ApiPropertyOptional({ description: 'Point name', maxLength: 100, example: 'Опушка у берез' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Point description',
    maxLength: 500,
    example: 'Хорошее место для старта маршрута, рядом небольшая стоянка.',
  })
  description?: string;

  @ApiPropertyOptional({ description: 'Tag ObjectId for point classification', example: '507f1f77bcf86cd799439012' })
  tag?: string;

  @ApiPropertyOptional({ description: 'Point coordinates', type: CoordinatesDto })
  coordinates?: CoordinatesDto;

  @ApiPropertyOptional({ description: 'Point avatar image path', maxLength: 255, example: 'points/point_icon.png' })
  image_path?: string;
}