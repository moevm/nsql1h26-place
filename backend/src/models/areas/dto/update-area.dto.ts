import { ApiPropertyOptional } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiPropertyOptional({ description: 'Area center X coordinate', example: 59.773007 })
  x?: number;

  @ApiPropertyOptional({ description: 'Area center Y coordinate', example: 30.775178 })
  y?: number;
}

export class UpdateAreaDto {
  @ApiPropertyOptional({ description: 'Area name', maxLength: 100, example: 'Березовая роща' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Area description',
    maxLength: 500,
    example: 'Широкая зона с плотной растительностью и несколькими входами.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Tag ObjectIds for area classification',
    type: [String],
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
  })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Area center coordinates', type: CoordinatesDto })
  coordinates?: CoordinatesDto;

  @ApiPropertyOptional({ description: 'Area radius', example: 300 })
  radius?: number;

  @ApiPropertyOptional({ description: 'Area avatar image path', maxLength: 255, example: 'areas/area_icon.png' })
  image_path?: string;
}